/**
 * A field of hexagonal basalt columns rendered with Three.js.
 *
 * Every 3D scene on the site (hero, step story, AI grid, case study, self-assessment and the
 * footer skyline) is a configuration of this one class, so they all look alike. The field
 * renders only while it is on screen and cleans up completely in `dispose()`.
 */
import * as THREE from "three";

import { CONTEXT_LOST_EVENT } from "./constants";
import { type Cell, cellAt } from "./hex";
import { clamp01, damp, ease, rng } from "./math";
import { addToLoop, isCalm, kick, now } from "./motion";

let webglSupport: boolean | null = null;

/**
 * Whether this browser can create a WebGL 2 context, which Three.js requires. Checked once,
 * without Three.js logging errors; the probe context is released at once because browsers
 * limit how many can be alive.
 */
export function webglAvailable(): boolean {
  if (webglSupport === null) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      webglSupport = gl !== null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

type Vec3 = [number, number, number];
type Goals = number[] | ((cell: Cell, index: number) => number);

export type FieldOptions = {
  cells: Cell[];
  /** Index of the mint column (the tallest one), if the scene has one. */
  mintIndex?: number | null;
  /** Starting heights. */
  goals?: Goals;

  // Geometry
  radius?: number;
  gap?: number;

  // Camera
  fov?: number;
  cam?: Vec3;
  look?: Vec3;
  /** Second camera position, blended in with `camK` (0..1). */
  cam2?: Vec3 | null;
  look2?: Vec3 | null;
  /** How far the camera drifts with the pointer, [x, y]. */
  parallax?: [number, number];
  /** Adjusts the camera when the canvas changes size. */
  fit?: (field: BasaltField, aspect: number) => void;

  // Light and colour
  fog?: string | null;
  fogNear?: number;
  fogFar?: number;
  deep?: string;
  bright?: string;
  mintColor?: string;
  lighting?: "dark" | "light";
  hemi?: number;
  key?: number;
  rim?: number;
  /** Brightness of the column sides relative to the tops. */
  sideShade?: number;
  /** Heights mapped to the deep → bright colour ramp. */
  hLo?: number;
  hHi?: number;
  /** Fixed colour per column; replaces the height ramp. */
  colorOf?: (index: number) => THREE.Color;
  glow?: number;

  // Pointer
  lift?: number;
  liftRadius?: number;
  liftColor?: string | null;
  /** Lift by distance along x only (row layouts). */
  liftX?: boolean;
  ripple?: boolean;
  /** Height of the plane the pointer is projected on. */
  hitY?: number;
  /** Project the pointer on a vertical plane instead (row layouts). */
  hitPlaneZ?: boolean;
  /** Element whose area counts as "pointer inside" (defaults to the host). */
  region?: HTMLElement | null;
  /** Follow the pointer horizontally only, at this fixed vertical position. */
  trackX?: boolean;
  trackY?: number;

  // Motion
  idleAmp?: number;
  idleSpeed?: number;
  autoIntro?: boolean;
  introSpread?: number;
  introDur?: number;
  introMintDelay?: number;
  introDelay?: ((cell: Cell, index: number, random: () => number) => number) | null;
  seed?: number;
  maxDpr?: number;
  /** Multisample antialiasing. Off by default: the columns are flat-shaded, so the extra samples barely show. */
  antialias?: boolean;
  /** Transparent canvas. Off clears to the fog colour and skips a full-screen blend. */
  alpha?: boolean;

  // Highlighting
  emphColor?: string;
  emphMix?: number;
  emphLift?: number;
  dimColor?: string | null;
  dimMix?: number;
  flagColor?: string;

  /** Called before every frame, for scroll-driven scenes. */
  beforeUpdate?: (time: number, field: BasaltField) => void;
};

/** Options that always have a value after defaults are applied. */
type DefaultedKey =
  | "radius"
  | "gap"
  | "fov"
  | "cam"
  | "look"
  | "parallax"
  | "fogNear"
  | "fogFar"
  | "deep"
  | "bright"
  | "mintColor"
  | "lighting"
  | "sideShade"
  | "hLo"
  | "hHi"
  | "lift"
  | "liftRadius"
  | "ripple"
  | "idleAmp"
  | "idleSpeed"
  | "autoIntro"
  | "introSpread"
  | "introDur"
  | "introMintDelay"
  | "hitY"
  | "maxDpr"
  | "emphColor"
  | "emphMix"
  | "emphLift"
  | "dimMix"
  | "flagColor"
  | "glow";

type ResolvedOptions = FieldOptions & Required<Pick<FieldOptions, DefaultedKey>>;

const DEFAULTS: Required<Pick<FieldOptions, DefaultedKey>> & Partial<FieldOptions> = {
  radius: 0.5,
  gap: 0.05,
  fov: 30,
  cam: [-2, 7, 11.5],
  look: [0.8, 1.4, -0.6],
  parallax: [1.3, 0.7],
  fog: "#1B2A6B",
  fogNear: 15,
  fogFar: 29,
  deep: "#18256C",
  bright: "#3559F0",
  mintColor: "#2EE6A8",
  lighting: "dark",
  sideShade: 0.36,
  hLo: 0.3,
  hHi: 3,
  lift: 0,
  liftRadius: 1.1,
  ripple: false,
  idleAmp: 0.045,
  idleSpeed: 0.7,
  autoIntro: true,
  introSpread: 0.85,
  introDur: 1.0,
  introMintDelay: 1.15,
  hitY: 1.2,
  maxDpr: 2,
  emphColor: "#9DB2FF",
  emphMix: 0.5,
  emphLift: 0,
  dimMix: 0.6,
  flagColor: "#A9BCFF",
  glow: 3.5,
};

type Ripple = { x: number; z: number; t0: number; a: number };

/** Everything the field tracks per column. */
type Column = {
  cell: Cell;
  isMint: boolean;
  /** Intro: seconds before this column starts rising, and how long it takes. */
  delay: number;
  introDuration: number;
  /** Offset of the idle "breathing" wave. */
  phase: number;
  /** Height tween: from → to, starting at t0, lasting dur seconds. */
  from: number;
  to: number;
  t0: number;
  dur: number;
  /** Current extra height from the pointer. */
  lift: number;
};

export class BasaltField {
  readonly o: ResolvedOptions;
  readonly cells: Cell[];
  readonly n: number;
  readonly mint: number | null;
  readonly minX: number;
  readonly spanX: number;
  /** False when WebGL is not available; the caller should show a fallback. */
  readonly ok: boolean = false;

  /** Columns marked as bottlenecks (shown while `scan` is on). */
  flags: Uint8Array | null = null;
  /** A light sweeps across the field and the flags blink. */
  scan = false;
  /** Pulse period in seconds; 0 = off. */
  pulse = 0;
  /** Blend between the two camera positions, 0..1. */
  camK = 0;
  ripples: Ripple[] = [];
  visible = false;

  private readonly host: HTMLElement;
  private readonly columns: Column[];
  private renderer: THREE.WebGLRenderer | null = null;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private mesh: THREE.InstancedMesh | null = null;
  private mintMesh: THREE.Mesh | null = null;
  private glowLight: THREE.PointLight | null = null;
  private emph: Uint8Array | null = null;
  private emphOn = false;
  private emphK = 0;
  private scanK = 0;
  private pulseK = 0;
  private introAt: number | null = null;
  private readonly pointer = { inside: false, nx: 0, ny: 0 };
  private readonly camOffset = { x: 0, y: 0 };
  private readonly cleanups: Array<() => void> = [];

  // Scratch objects reused every frame.
  private readonly c1: THREE.Color;
  private readonly c2: THREE.Color;
  private readonly emphCol: THREE.Color;
  private readonly dimCol: THREE.Color;
  private readonly flagCol: THREE.Color;
  private readonly liftCol: THREE.Color | null;
  private readonly tmp = new THREE.Color();
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly s = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  private readonly v2 = new THREE.Vector2();
  private readonly v3 = new THREE.Vector3();
  private readonly ray = new THREE.Raycaster();
  private readonly plane: THREE.Plane;

  constructor(host: HTMLElement, options: FieldOptions) {
    const o = (this.o = { ...DEFAULTS, ...options } as ResolvedOptions);
    this.host = host;
    this.cells = o.cells;
    this.n = this.cells.length;
    this.mint = o.mintIndex ?? null;
    this.camera = new THREE.PerspectiveCamera(o.fov, 1, 0.1, 140);

    const xs = this.cells.map((c) => c.x);
    this.minX = Math.min(...xs);
    this.spanX = Math.max(...xs) - this.minX || 1;

    const random = rng(o.seed ?? 7);
    this.columns = this.cells.map((cell, i) => {
      const isMint = i === this.mint;
      const delay = o.introDelay
        ? o.introDelay(cell, i, random)
        : isMint
          ? o.introMintDelay
          : 0.05 + ((cell.x - this.minX) / this.spanX) * o.introSpread + random() * 0.2;
      return {
        cell,
        isMint,
        delay,
        introDuration: 0,
        phase: cell.x * 0.55 + cell.z * 0.4,
        from: 0,
        to: 0,
        t0: -1e9,
        dur: 0.001,
        lift: 0,
      };
    });
    // Drawn after the delays so the random sequence matches the original layout.
    for (const column of this.columns) {
      column.introDuration = column.isMint ? 1.35 : o.introDur * (0.9 + random() * 0.35);
    }
    if (o.goals) this.setGoalsNow(o.goals);

    this.c1 = new THREE.Color(o.deep);
    this.c2 = new THREE.Color(o.bright);
    this.emphCol = new THREE.Color(o.emphColor);
    this.dimCol = new THREE.Color(o.dimColor ?? o.fog ?? "#1B2A6B");
    this.flagCol = new THREE.Color(o.flagColor);
    this.liftCol = o.liftColor ? new THREE.Color(o.liftColor) : null;
    // Pointer picking: the top plane of the field, or a vertical plane for row layouts.
    this.plane = o.hitPlaneZ
      ? new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      : new THREE.Plane(new THREE.Vector3(0, 1, 0), -o.hitY);

    if (!webglAvailable()) return; // `ok` stays false and the caller shows its fallback.
    let renderer: THREE.WebGLRenderer;
    try {
      const alpha = o.alpha !== false;
      renderer = new THREE.WebGLRenderer({
        antialias: o.antialias === true,
        alpha,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(alpha ? 0x000000 : (o.fog ?? "#1B2A6B"), alpha ? 0 : 1);
    } catch {
      return;
    }
    const dprCap = window.innerWidth < 760 ? Math.min(1.5, o.maxDpr) : o.maxDpr;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.ok = true;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      host.dispatchEvent(new CustomEvent(CONTEXT_LOST_EVENT));
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    this.cleanups.push(() => renderer.domElement.removeEventListener("webglcontextlost", onContextLost));

    this.buildScene();
    this.listen();
    this.resize();
    this.cleanups.push(addToLoop(this));
  }

  private buildScene() {
    const o = this.o;
    const scene = this.scene;
    if (o.fog) scene.fog = new THREE.Fog(new THREE.Color(o.fog), o.fogNear, o.fogFar);

    if (o.lighting === "light") {
      scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa6bd, 1.35));
      const key = new THREE.DirectionalLight(0xffffff, 1.55);
      key.position.set(-6, 12, 9);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xcdd8ff, 0.55);
      fill.position.set(8, 6, -6);
      scene.add(fill);
    } else {
      scene.add(new THREE.HemisphereLight(0xe6ecff, 0x0a1240, o.hemi ?? 1.05));
      const key = new THREE.DirectionalLight(0xffffff, o.key ?? 1.75);
      key.position.set(-7, 12, 8);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x8aa2ff, o.rim ?? 1.0);
      rim.position.set(9, 5, -9);
      scene.add(rim);
    }

    // One prism with its base at y = 0 and lighter top faces, like real basalt.
    let geometry: THREE.BufferGeometry = new THREE.CylinderGeometry(o.radius - o.gap, o.radius - o.gap, 1, 6, 1, false);
    geometry.translate(0, 0.5, 0);
    geometry = geometry.toNonIndexed();
    const position = geometry.getAttribute("position");
    const shade = (top: number, side: number) => {
      const values = new Float32Array(position.count * 3);
      for (let i = 0; i < position.count; i += 3) {
        const isTop = position.getY(i) > 0.999 && position.getY(i + 1) > 0.999 && position.getY(i + 2) > 0.999;
        values.fill(isTop ? top : side, i * 3, i * 3 + 9);
      }
      return new THREE.BufferAttribute(values, 3);
    };
    const mintGeometry = geometry.clone();
    geometry.setAttribute("color", shade(1, o.sideShade));
    mintGeometry.setAttribute("color", shade(0.74, 0.5));

    const others = this.n - (this.mint === null ? 0 : 1);
    const material = new THREE.MeshLambertMaterial({
      vertexColors: true,
      flatShading: true,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, others);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const start = new THREE.Color(o.deep);
    for (let k = 0; k < others; k++) mesh.setColorAt(k, start);
    scene.add(mesh);
    this.mesh = mesh;

    if (this.mint !== null) {
      const cell = cellAt(this.cells, this.mint);
      const mintMaterial = new THREE.MeshLambertMaterial({
        vertexColors: true,
        flatShading: true,
        color: new THREE.Color(o.mintColor),
        emissive: new THREE.Color(o.mintColor),
        emissiveIntensity: 0.1,
      });
      this.mintMesh = new THREE.Mesh(mintGeometry, mintMaterial);
      this.mintMesh.position.set(cell.x, 0, cell.z);
      scene.add(this.mintMesh);
      this.glowLight = new THREE.PointLight(0x2ee6a8, 0, 6, 2);
      this.glowLight.position.set(cell.x, 1, cell.z);
      scene.add(this.glowLight);
    } else {
      mintGeometry.dispose();
    }
  }

  private listen() {
    const o = this.o;
    const host = this.host;
    const region = o.region ?? host;

    // Anywhere over the host (or over `region`) counts as "inside".
    const onMove = (event: PointerEvent) => {
      const a = host.getBoundingClientRect();
      const b = region.getBoundingClientRect();
      this.pointer.inside =
        event.clientX >= b.left && event.clientX <= b.right && event.clientY >= b.top && event.clientY <= b.bottom;
      this.pointer.nx = ((event.clientX - a.left) / a.width) * 2 - 1;
      this.pointer.ny = o.trackX ? (o.trackY ?? -0.1) : -(((event.clientY - a.top) / a.height) * 2 - 1);
      if (this.visible) kick();
    };
    const onLeave = () => {
      this.pointer.inside = false;
    };
    const onScroll = () => {
      if (this.visible) kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    this.cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
    });

    if (o.ripple) {
      const onDown = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!this.visible || isCalm() || target?.closest("a, button, input, label, [role=tab]")) return;
        const a = host.getBoundingClientRect();
        if (event.clientX < a.left || event.clientX > a.right || event.clientY < a.top || event.clientY > a.bottom)
          return;
        const hit = this.hitPoint(
          ((event.clientX - a.left) / a.width) * 2 - 1,
          -(((event.clientY - a.top) / a.height) * 2 - 1),
        );
        if (hit) this.addRipple(hit.x, hit.z);
      };
      window.addEventListener("pointerdown", onDown);
      this.cleanups.push(() => window.removeEventListener("pointerdown", onDown));
    }

    const resizeObserver = new ResizeObserver(() => {
      this.resize();
      kick();
    });
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry?.isIntersecting ?? false;
        if (this.visible && this.introAt === null && o.autoIntro) this.introAt = now();
        if (this.visible) kick();
      },
      { rootMargin: "60px 0px" },
    );
    visibilityObserver.observe(host);
    this.cleanups.push(() => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    });
  }

  /** Highlights the columns in `mask` (1 = emphasised) and dims the rest; `null` clears it. */
  setEmphasis(mask: Uint8Array | null) {
    if (mask) this.emph = mask;
    this.emphOn = !!mask;
    kick();
  }

  /** Starts the intro now (for fields created with `autoIntro: false`). */
  start() {
    if (this.introAt === null) this.introAt = now();
    kick();
  }

  /** Adds a ripple that spreads from a point on the ground plane. */
  addRipple(x: number, z: number, strength = 0.75) {
    if (isCalm()) return;
    this.ripples.push({ x, z, t0: now(), a: strength });
    kick();
  }

  /** Where a point in normalised device coordinates meets the hit plane. */
  hitPoint(nx: number, ny: number): { x: number; z: number } | null {
    this.v2.set(nx, ny);
    this.ray.setFromCamera(this.v2, this.camera);
    const out = this.ray.ray.intersectPlane(this.plane, this.v3);
    return out ? { x: out.x, z: out.z } : null;
  }

  private static goalAt(column: Column, t: number): number {
    const k = clamp01((t - column.t0) / column.dur);
    return column.from + (column.to - column.from) * ease.inOutCubic(k);
  }

  /** Animates every column to a new height. */
  setGoals(
    goals: Goals,
    { dur = 1.2, stagger = null }: { dur?: number; stagger?: ((cell: Cell, index: number) => number) | null } = {},
  ) {
    const calm = isCalm();
    const at = calm ? -1e9 : now();
    this.columns.forEach((column, i) => {
      const goal = typeof goals === "function" ? goals(column.cell, i) : (goals[i] ?? column.to);
      column.from = BasaltField.goalAt(column, calm ? 1e9 : at);
      column.to = goal;
      column.t0 = at + (stagger ? stagger(column.cell, i) : 0);
      column.dur = dur;
    });
    kick();
  }

  /** Sets every column's height without animating. */
  setGoalsNow(goals: Goals) {
    this.columns.forEach((column, i) => {
      const goal = typeof goals === "function" ? goals(column.cell, i) : (goals[i] ?? column.to);
      column.from = goal;
      column.to = goal;
      column.t0 = -1e9;
      column.dur = 0.001;
    });
  }

  resize() {
    if (!this.renderer) return;
    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = this.o.fov;
    this.o.fit?.(this, width / height);
    this.camera.updateProjectionMatrix();
  }

  /**
   * True while something on this field is still moving. A resting field drops out of the
   * shared frame loop; scrolling, pointing, or a new goal calls `kick()` to wake it.
   */
  private awake(time: number): boolean {
    if (this.pointer.inside) return true;
    if (this.ripples.length > 0) return true;
    if (this.scan || this.pulse > 0) return true;
    if (Math.abs(this.emphK - (this.emphOn ? 1 : 0)) > 0.015) return true;
    if (Math.abs(this.scanK - (this.scan ? 1 : 0)) > 0.015) return true;
    if (Math.abs(this.pulseK - (this.pulse > 0 ? 1 : 0)) > 0.015) return true;
    if (Math.hypot(this.camOffset.x, this.camOffset.y) > 0.004) return true;
    const intro0 = this.introAt;
    if (intro0 !== null) {
      for (const column of this.columns) {
        if (time < intro0 + column.delay + column.introDuration) return true;
      }
    }
    for (const column of this.columns) {
      if (column.lift > 0.004) return true;
      if (time < column.t0 + column.dur) return true;
    }
    return false;
  }

  update(time: number, delta: number): boolean {
    const renderer = this.renderer;
    const mesh = this.mesh;
    if (!renderer || !mesh) return false;
    const o = this.o;
    const calm = isCalm();
    const T = calm ? 1e4 : time;
    const dt = calm ? 1 : delta;
    o.beforeUpdate?.(T, this);

    // Camera: optional blend between two positions, plus a little parallax from the pointer.
    const active = !calm && this.pointer.inside;
    this.camOffset.x = damp(this.camOffset.x, active ? this.pointer.nx : 0, 3, dt);
    this.camOffset.y = damp(this.camOffset.y, active && !o.trackX ? this.pointer.ny : 0, 3, dt);
    const k = this.camK;
    const [px, py, pz] = o.cam;
    const [lx, ly, lz] = o.look;
    const [px2, py2, pz2] = o.cam2 ?? o.cam;
    const [lx2, ly2, lz2] = o.look2 ?? o.look;
    const mix = (a: number, b: number) => a + (b - a) * k;
    this.camera.position.set(
      mix(px, px2) + this.camOffset.x * o.parallax[0],
      mix(py, py2) + this.camOffset.y * o.parallax[1],
      mix(pz, pz2),
    );
    this.camera.lookAt(mix(lx, lx2), mix(ly, ly2), mix(lz, lz2));
    this.camera.updateMatrixWorld();

    let hit: { x: number; z: number } | null = null;
    if (active && o.lift > 0) hit = this.hitPoint(this.pointer.nx, this.pointer.ny);

    this.emphK = damp(this.emphK, this.emphOn ? 1 : 0, 7, dt);
    this.scanK = damp(this.scanK, this.scan ? 1 : 0, 4, dt);
    this.pulseK = damp(this.pulseK, this.pulse ? 1 : 0, 3, dt);
    this.ripples = this.ripples.filter((r) => T - r.t0 < 4);
    const scanX = this.minX - 1.5 + ((T * 2.4) % (this.spanX + 3));
    const intro0 = this.introAt;
    const mintCell = this.mint === null ? null : (this.columns[this.mint]?.cell ?? null);

    let mintH = 0;
    let instance = 0;
    this.columns.forEach((column, i) => {
      const c = column.cell;
      const introK =
        intro0 === null
          ? 0
          : (column.isMint ? ease.outBack : ease.outCubic)(clamp01((T - intro0 - column.delay) / column.introDuration));
      const base = BasaltField.goalAt(column, T);
      let h = base * introK;
      if (!calm && o.idleAmp) {
        const amplitude = column.isMint ? o.idleAmp * 0.45 : o.idleAmp;
        h *= 1 + amplitude * Math.sin(T * o.idleSpeed - column.phase) * clamp01(introK * 1.2 - 0.2);
      }
      let liftTarget = 0;
      if (hit) {
        const d2 = o.liftX ? (c.x - hit.x) ** 2 : (c.x - hit.x) ** 2 + (c.z - hit.z) ** 2;
        liftTarget = o.lift * Math.exp(-d2 / (2 * o.liftRadius * o.liftRadius));
      }
      column.lift = calm ? 0 : damp(column.lift, liftTarget, 9, dt);
      h += column.lift;
      const emphasised = this.emph?.[i] === 1;
      if (emphasised) h += this.emphK * o.emphLift;
      if (!calm) {
        for (const r of this.ripples) {
          const age = T - r.t0;
          const d = Math.hypot(c.x - r.x, c.z - r.z);
          h += r.a * Math.exp(-age * 0.9) * Math.exp(-((d - age * 5.5) ** 2) / 0.45);
        }
        if (this.pulseK > 0.01 && mintCell) {
          const period = this.pulse || 2.4;
          const d = Math.hypot(c.x - mintCell.x, c.z - mintCell.z);
          const beat = Math.floor(T / period);
          for (const q of [beat, beat - 1]) {
            const age = T - q * period;
            if (age >= 0) h += this.pulseK * 0.34 * Math.exp(-age * 0.8) * Math.exp(-((d - age * 3.2) ** 2) / 0.6);
          }
        }
      }
      h = Math.max(0.02, h);
      if (column.isMint) {
        mintH = h;
        return;
      }
      this.p.set(c.x, 0, c.z);
      this.s.set(1, h, 1);
      mesh.setMatrixAt(instance, this.m4.compose(this.p, this.q, this.s));

      if (o.colorOf) this.tmp.copy(o.colorOf(i));
      else {
        const ck = clamp01((base * introK - o.hLo) / (o.hHi - o.hLo));
        this.tmp.copy(this.c1).lerp(this.c2, Math.pow(ck, 1.35));
      }
      if (this.liftCol && column.lift > 0.001) this.tmp.lerp(this.liftCol, clamp01(column.lift / o.lift) * 0.55);
      if (this.emph && this.emphK > 0.001) {
        if (emphasised) this.tmp.lerp(this.emphCol, this.emphK * o.emphMix);
        else this.tmp.lerp(this.dimCol, this.emphK * o.dimMix);
      }
      if (this.scanK > 0.01) {
        if (this.flags?.[i] === 1) this.tmp.lerp(this.flagCol, this.scanK * (0.6 + 0.3 * Math.sin(T * 5)));
        const beam = Math.exp(-((c.x - scanX) ** 2) / 0.35);
        this.tmp.lerp(this.flagCol, beam * 0.5 * this.scanK);
      }
      mesh.setColorAt(instance, this.tmp);
      instance++;
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (this.mintMesh && this.glowLight) {
      this.mintMesh.visible = mintH > 0.06;
      this.mintMesh.scale.set(1, mintH, 1);
      this.glowLight.position.y = mintH + 0.6;
      this.glowLight.intensity =
        intro0 === null ? 0 : o.glow * clamp01((T - intro0 - 1.6) / 1.2) * clamp01((mintH - 0.4) / 1.5);
    }
    renderer.render(this.scene, this.camera);
    return this.awake(T);
  }

  /** Stops rendering and frees every GPU resource and listener. */
  dispose() {
    this.visible = false;
    this.cleanups.splice(0).forEach((cleanup) => cleanup());
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const mesh = object as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
      mesh.geometry.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => material.dispose());
    });
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement.remove();
      this.renderer = null;
    }
    this.mesh = null;
    this.mintMesh = null;
  }
}
