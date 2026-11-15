# Architecture

How virkum.is works, and the rules that keep it fast, accessible and easy to change.

## Packages and dependencies

```
apps/web ──► @virkum/ui       (tokens, global CSS, React primitives)
        └──► @virkum/basalt   (Three.js engine + scenes + React hook)
```

- Packages ship TypeScript source; Next.js compiles them (`transpilePackages`), so there is no
  package build step.
- Each package exposes explicit entry points in its `package.json` `exports`. Import from those
  only, never from a package's internal files.
- `@virkum/ui` has two entry points: `@virkum/ui` (server-safe components and helpers) and
  `@virkum/ui/client` (hooks and components that need the browser). `@virkum/ui/styles.css` is the
  global stylesheet.
- `@virkum/basalt/react` (the hook) never imports Three.js. Scenes (`@virkum/basalt/scenes/*`) do,
  and are always loaded with a dynamic `import()`, so Three.js arrives as a separate file only when
  a scene starts. `pnpm --filter @virkum/web check:bundle` enforces this.

## Rendering and routing

- The site is a **static export** (`output: "export"` in `next.config.ts`): `next build` writes
  HTML, JavaScript and RSC payload files to `apps/web/out`. There is no server at runtime.
- Every URL has a language prefix and a trailing slash: `/is/daemi/`, `/en/daemi/`. Icelandic is
  the default language.
- `/` is redirected to `/is/` by Firebase Hosting (301). The page behind `/` also redirects in the
  browser (to the visitor's last chosen language), which covers local previews and other hosts.
- Unknown URLs get the branded 404 page (`app/global-not-found.tsx`, exported as `404.html`). It
  picks Icelandic or English from the address.
- Route files in `app/(site)/[locale]/` stay thin: they resolve the locale (`resolveLocale` in
  `i18n/server.ts`), build metadata (`lib/seo/metadata.ts`) and render one feature component.

## Languages

- [next-intl](https://next-intl.dev) with `localePrefix: "always"` (`i18n/routing.ts`).
- Copy is in `content/messages/is.json` and `en.json`. They must have the same keys and list
  lengths; `content/messages/messages.test.ts` fails otherwise. The message type comes from
  `is.json` (`i18n/next-intl.d.ts`), so `t("missing.key")` is a type error.
- Server components read copy with `getTranslations`. Client components get only the namespaces
  they need: the layout passes `header`, `common`, `cookieBanner` and `notFound`, and a page that
  needs more wraps its client part in its own `NextIntlClientProvider` (see `sjalfsmat/page.tsx`).
  This keeps the rest of the copy out of the browser bundle.
- The language switch (`components/layout/header/LanguageSwitch.tsx`) opens the same page in the
  other language, keeps the query string and hash (`i18n/paths.ts`), and remembers the choice.

## Content

- Page copy: `content/messages/*.json`.
- Blog posts: `content/blog/posts.ts`, typed by `content/blog/types.ts`. A post has the same slug in
  both languages. Posts feed the blog index, the article pages, the RSS feeds, the sitemap and the
  search.

## Styling

- **Tokens** are defined once in `packages/ui/src/styles/tokens.css` (Tailwind CSS 4 `@theme`):
  colours, fonts, radii, the brand easing curve and breakpoints. Tailwind turns them into utilities,
  and CSS Modules read the same CSS variables (`var(--color-navy)`). Don't hard-code a brand colour.
- **Shared classes** (`.wrap`, `.btn`, `.t-*`, `.on-dark`, scroll reveals) live in
  `packages/ui/src/styles/`, inside Tailwind's `base` and `components` cascade layers.
- **Component styles** are CSS Modules next to their component. Modules are unlayered, so they
  always win over the shared classes: a component can adjust a `.btn` without specificity tricks.
- **Keyframes** must be defined in the same CSS Module as the rule that uses them; CSS Modules
  rename keyframes per file.
- **Reveals**: an element with `.reveal` fades and slides in when it reaches the viewport
  (`RevealObserver` sets a `data-in` attribute). If a module sets `transition` on a `.reveal` element,
  it must keep `opacity` and `transform` in the list, or the element pops in instead of fading.
- **Breakpoints**: phones up to 759 px (`COMPACT_QUERY`), desktop navigation from 1080 px.
- **Fonts**: Manrope (headings) and Inter (text), self-hosted at build time by `next/font`.
- Everything respects `prefers-reduced-motion`: reveals show at once, scenes render a still frame.

## 3D scenes

- `packages/basalt/src/engine/field.ts` (`BasaltField`) renders a field of hexagonal columns with
  Three.js. Each file in `scenes/` configures it for one place on the site and returns a small
  controller (for example `setStep`, `highlight`, `setAnswers`).
- `useBasaltScene(hostRef, mount, { key, lazyMargin })` mounts a scene on the client:
  - `mount` loads the scene with `import()` and returns `null` if the `AbortSignal` it receives was
    aborted while loading;
  - `key` rebuilds the scene (for example when crossing the phone breakpoint);
  - `lazyMargin` waits until the host is near the viewport (the footer uses `600px`);
  - the scene is disposed on unmount, so client-side navigation never leaks WebGL contexts.
- A field renders only while it is on screen. If WebGL 2 is unavailable or the context is lost, the
  hook reports `failed` and the component shows its SVG fallback.

## Consent and analytics

- `components/consent/ConsentProvider.tsx` stores the visitor's choice in `localStorage`
  (`virkum-cookie-consent`). The banner shows until the visitor accepts or rejects.
- Google Analytics 4 (`@next/third-parties`) and the Meta Pixel (off unless
  `NEXT_PUBLIC_META_PIXEL_ID` is set) load only after **Accept**. Reject loads nothing.
- `components/navigation/PreserveSearchParams.tsx` keeps campaign parameters (UTM) on internal links.

## SEO

- `lib/seo/metadata.ts` builds titles, descriptions, canonical URLs, `hreflang` alternates and Open
  Graph data for every page.
- `lib/seo/json-ld.ts` builds schema.org data (organisation, services, courses, articles,
  breadcrumbs); `components/seo/JsonLd.tsx` renders it safely escaped.
- `app/sitemap.ts` and `app/robots.ts` generate `sitemap.xml` and `robots.txt`; each language has
  an RSS feed at `/<locale>/blogg/feed.xml`.

## Configuration

- `config/site.ts`: site URL, contact e-mail, booking link, sources, blog author.
- `config/env.ts`: public environment variables, validated with zod at build time. An invalid value
  fails the build. See `apps/web/.env.example`.

## Budgets

| What                                 | Limit                         | Enforced by                 |
| ------------------------------------ | ----------------------------- | --------------------------- |
| Initial JavaScript per page          | 250 KB gzip                   | `check:bundle` (CI)         |
| Three.js in a page's initial scripts | never                         | `check:bundle` (CI)         |
| Accessibility                        | WCAG 2.1 AA, no axe violation | `e2e/accessibility.spec.ts` |
| Sideways scrolling, broken images    | none, on any page or device   | `e2e/pages.spec.ts`         |
| Console errors                       | none                          | every end-to-end test       |
