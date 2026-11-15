# @virkum/ui

Virkum's design system: brand tokens, global styles and React primitives.

## Use

```css
/* the app's global stylesheet */
@import "tailwindcss";
@import "@virkum/ui/styles.css";
@source "<path to>/packages/ui/src";
```

```tsx
import { Columns, CutCorner, PageHead, cn } from "@virkum/ui"; // safe in server components
import { CountUp, RevealObserver, useMediaQuery } from "@virkum/ui/client"; // browser only
```

## Contents

- `src/styles/tokens.css`: colours, fonts, radii, easing and breakpoints (Tailwind `@theme static`).
- `src/styles/base.css`, `components.css`, `motion.css`: element defaults, shared classes (`.wrap`,
  `.btn`, `.t-*`, `.on-dark`) and scroll reveals, in Tailwind's cascade layers.
- `src/components/`: `Arrow`, `Columns` (the SVG column motif), `CutCorner`, `CountUp`, `PageHead`,
  `ReadingProgress`, `RevealWords`.
- `src/motion/RevealObserver.tsx`: marks `.reveal` and `.rise` elements with `data-in` as they enter
  the viewport.
- `src/lib/`: `cn`, number and text helpers, easing.

Rules for using the styles are in the repository's `CONTRIBUTING.md`.
