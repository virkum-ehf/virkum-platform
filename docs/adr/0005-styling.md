# 0005. Tailwind CSS 4 tokens with CSS Modules

- Status: Accepted
- Date: 2026-11-15

## Context

The design relies on a small set of brand tokens and a few shared classes, while most styles are
specific to one component and often complex (pinned scroll stories, clip paths, staggered motion).

## Decision

- Tokens are defined once with Tailwind CSS 4 `@theme static` in `packages/ui`. Utilities and CSS
  Modules read the same CSS variables.
- Shared classes (layout, buttons, type scale, reveals) live in Tailwind's `base` and `components`
  cascade layers.
- Component styles are CSS Modules next to their component. They are unlayered, so they always
  override the shared classes.

## Consequences

- Overrides are predictable: a component's own CSS wins, without `!important` or specificity tricks.
- Because modules win, a module must not replace the transition of a `.reveal` element without
  keeping `opacity` and `transform` (documented in `motion.css` and CONTRIBUTING).
- CSS Modules rename keyframes, so keyframes stay in the module that uses them.
- Tailwind utilities remain available for small layout adjustments and for future apps.
