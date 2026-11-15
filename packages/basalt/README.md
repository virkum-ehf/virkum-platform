# @virkum/basalt

The basalt-column 3D scenes, built on Three.js, with a React hook.

## Use

```tsx
"use client";
import { useBasaltScene } from "@virkum/basalt/react";

const hostRef = useRef<HTMLDivElement>(null);
const { status, controllerRef } = useBasaltScene(hostRef, async (host, signal) => {
  const { mountStepsScene } = await import("@virkum/basalt/scenes/steps");
  if (signal.aborted) return null;
  return mountStepsScene(host);
});
// status: "loading" | "ready" | "failed" (show a fallback when "failed")
```

Always import scenes with `import()`: that keeps Three.js out of the page's initial JavaScript.

## Contents

- `src/engine/field.ts`: `BasaltField`, a field of hexagonal columns. Renders only while on screen,
  supports reduced motion (still frame), and releases its WebGL context in `dispose()`.
- `src/engine/{hex,math,motion,constants}.ts`: layout, maths, the shared animation loop and events.
- `src/scenes/*.ts`: one module per scene (`hero`, `steps`, `aiGrid`, `caseStudy`, `quiz`, `skyline`),
  each returning a controller.
- `src/react/useBasaltScene.ts`: mounts, rebuilds (`key`), defers (`lazyMargin`) and disposes scenes.
