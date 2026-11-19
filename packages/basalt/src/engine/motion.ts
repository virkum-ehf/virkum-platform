/**
 * One clock and one frame loop for every animated piece on the page.
 * Items render only while they are visible, and the loop stops when nothing needs it.
 * With "reduce motion" on, each kick draws a single still frame in the final state.
 */

export type LoopItem = {
  /** Only visible items are updated. */
  visible: boolean;
  /** Returns true while the item still needs another frame. */
  update(time: number, delta: number): boolean;
};

const isBrowser = typeof window !== "undefined";
const origin = isBrowser ? performance.now() : 0;
const items = new Set<LoopItem>();
let frameId = 0;
let lastTime: number | null = null;

const reducedMotion =
  isBrowser && typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
let calm = reducedMotion?.matches ?? false;

/** True when the visitor prefers reduced motion: render final states, no animation. */
export const isCalm = (): boolean => calm;

/** Seconds since the page loaded. */
export const now = (): number => (isBrowser ? (performance.now() - origin) / 1000 : 0);

function frame() {
  frameId = 0;
  const time = now();
  const delta = lastTime === null ? 1 / 60 : Math.min(0.05, Math.max(0, time - lastTime));
  lastTime = time;
  let busy = false;
  for (const item of items) {
    if (!item.visible) continue;
    if (item.update(time, delta)) busy = true;
  }
  if (!calm && busy && !document.hidden) frameId = requestAnimationFrame(frame);
}

/** Schedules a frame if none is pending. */
export function kick(): void {
  if (isBrowser && !frameId) frameId = requestAnimationFrame(frame);
}

/** Adds an item to the loop and returns a function that removes it. */
export function addToLoop(item: LoopItem): () => void {
  items.add(item);
  kick();
  return () => {
    items.delete(item);
  };
}

if (isBrowser) {
  reducedMotion?.addEventListener("change", (event) => {
    calm = event.matches;
    kick();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      lastTime = null;
      kick();
    }
  });
}
