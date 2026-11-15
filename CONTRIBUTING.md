# Contributing

## Workflow

1. Branch from `main` (`feat/…`, `fix/…`, `chore/…`).
2. Commit with [Conventional Commits](https://www.conventionalcommits.org): `feat(web): add pricing page`,
   `fix(basalt): dispose the skyline on unmount`. The commit hook checks the message and formats the
   staged files.
3. Before opening a pull request, run `pnpm check` (lint, types, unit tests). For changes to pages,
   styles or scenes, also run `pnpm e2e`.
4. Open a pull request. CI must be green before merging; prefer squash merges.

## Where things go

| You are adding…                  | Put it in                                                      |
| -------------------------------- | -------------------------------------------------------------- |
| A page                           | `apps/web/src/app/(site)/[locale]/<slug>/page.tsx` + a feature |
| The components of a page/section | `apps/web/src/features/<feature>/`                             |
| A part used on every page        | `apps/web/src/components/`                                     |
| A reusable visual primitive      | `packages/ui/src/components/`                                  |
| A 3D scene                       | `packages/basalt/src/scenes/<name>.ts`                         |
| Copy                             | `apps/web/src/content/messages/is.json` **and** `en.json`      |
| A blog post                      | `apps/web/src/content/blog/posts.ts` (both languages)          |
| A site-wide constant             | `apps/web/src/config/site.ts`                                  |
| A public environment variable    | `apps/web/src/config/env.ts` + `apps/web/.env.example`         |

## Recipes

### Add a page

1. Create `app/(site)/[locale]/<slug>/page.tsx`. Resolve the locale with `resolveLocale(params)`,
   export `generateMetadata` using `buildPageMetadata`, and render a component from `features/`.
2. Add the page's copy to both message files.
3. Add the path to `config/pages.ts`. The sitemap and the end-to-end tests (page, accessibility
   and overflow checks in every browser) then include it.
4. If it belongs in the menu, add it to `components/layout/header/navigation.ts`.

### Change copy

Edit the same key in `is.json` and `en.json`. Never put copy in components. The message test fails
if the two files drift apart.

### Add a blog post

Add an entry with the same `slug` to both the `is` and `en` lists in `content/blog/posts.ts`. The
index, article page, RSS feeds, sitemap and search pick it up automatically.

### Add a 3D scene

1. Create `packages/basalt/src/scenes/<name>.ts` exporting `mount<Name>Scene(host, …)`, built on
   `BasaltField`, returning a controller or `null` when WebGL is unavailable. Add a test next to the
   other scene tests.
2. In the component, call `useBasaltScene` with a `mount` that imports the scene dynamically and
   returns `null` if the signal was aborted. Pass `lazyMargin` if the scene is far down the page.
3. Render a flat fallback when the status is `failed`.

## Code rules

- TypeScript strict; no `any`, no non-null assertions in app code, no unchecked indexing.
- Server components by default. Add `"use client"` only to the component that needs the browser.
- State that lives outside React (storage, the URL, media queries) is read with
  `useSyncExternalStore`, not copied into state in an effect.
- Import packages through their public entry points only (`@virkum/ui`, `@virkum/ui/client`,
  `@virkum/basalt/react`, `@virkum/basalt/scenes/*`).
- Three.js is only ever imported inside `packages/basalt`, and the app reaches it only through
  dynamic `import()`.

## CSS rules

- Use the tokens (`var(--color-…)`, `var(--font-display)`, `var(--ease-brand)`). New brand values go
  into `packages/ui/src/styles/tokens.css` first.
- One CSS Module per component, next to it. Keep `@keyframes` in the module that uses them.
- Do not set `transition` on a `.reveal`, `.cr` or `.cf` element unless the list keeps `opacity` and
  `transform`.
- Text meets WCAG AA contrast: 4.5:1 for body text, 3:1 for large text (24 px, or 18.7 px bold).
- Check phones (360–430 px), tablets (768–1024 px) and desktops; nothing may scroll sideways.

## Accessibility

- Every interactive element is reachable and usable with the keyboard and has a visible focus style.
- Images have meaningful `alt` text, or `alt=""` when decorative. Icon-only links and buttons have an
  `aria-label`.
- Animations respect `prefers-reduced-motion`.
- Names of people, companies and brands, and avatar initials, carry `translate="no"`, so browser
  translation (for example Chrome translating the Icelandic page) leaves them as they are.
- The axe tests must stay at zero violations.

## Tests

- Unit tests sit next to the code (`*.test.ts`) and run with `pnpm test`.
- End-to-end tests are in `apps/web/e2e/`. Run `pnpm --filter @virkum/web e2e:install` once, then
  `pnpm e2e`. A single browser: `pnpm --filter @virkum/web exec playwright test --project=webkit`.
- To test a deployed site, set `E2E_BASE_URL`, for example
  `E2E_BASE_URL=https://virkum-landingpage--pr-12-abc123.web.app pnpm --filter @virkum/web e2e`.
