# 0003. A framework-free 3D engine package

- Status: Accepted
- Date: 2026-11-15

## Context

The basalt-column scenes are the signature of the brand and appear six times on the site. They need
precise control over rendering, disposal, reduced motion and fallbacks, and they should be reusable in
future apps.

## Decision

Keep the scenes in `@virkum/basalt`: one imperative Three.js engine (`BasaltField`), one module per
scene returning a small controller, and a thin React hook (`useBasaltScene`). The hook never imports
Three.js; scenes are loaded with dynamic `import()`. We do not use react-three-fiber.

## Consequences

- Three.js (about 140 KB gzip) downloads only on pages that show a scene, after the page is
  interactive. A CI check fails if it ever reaches a page's initial JavaScript.
- Each scene is disposed on unmount and its WebGL context released, so client-side navigation does
  not leak memory.
- Without WebGL 2, or after a lost context, every scene falls back to flat SVG columns.
- Scene logic can be unit-tested without React.
