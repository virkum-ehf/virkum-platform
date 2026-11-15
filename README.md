# Virkum platform

The code behind [virkum.is](https://virkum.is), and the home for Virkum's future client applications.
It is a [Turborepo](https://turborepo.com) monorepo managed with [pnpm](https://pnpm.io).

| Path                         | What it is                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `apps/web`                   | virkum.is: Next.js 16 (App Router), exported as static files, Icelandic/English |
| `packages/ui`                | `@virkum/ui`: design tokens, global styles and React primitives                 |
| `packages/basalt`            | `@virkum/basalt`: the Three.js basalt-column scenes, with a React hook          |
| `packages/eslint-config`     | Shared ESLint configuration                                                     |
| `packages/typescript-config` | Shared strict `tsconfig` bases                                                  |

## Quick start

You need Node.js 22.22 or later (see `.nvmrc`) and pnpm 12. Corepack, which ships with Node 22,
provides the exact pnpm version pinned in `package.json`:

```bash
corepack enable
```

```bash
pnpm install
```

```bash
pnpm dev
```

Then open <http://localhost:3000/is/> (Icelandic) or <http://localhost:3000/en/> (English).

If you prefer not to enable Corepack's shims, prefix each command with `corepack pnpm@12.21.0`
instead of `pnpm`.

## Scripts

From the repository root. Turborepo runs each task in every package that defines it, in parallel,
and caches the results.

| Command          | What it does                                                  |
| ---------------- | ------------------------------------------------------------- |
| `pnpm dev`       | Starts the site's development server                          |
| `pnpm build`     | Builds everything; the site is exported to `apps/web/out`     |
| `pnpm lint`      | ESLint with type-aware rules                                  |
| `pnpm typecheck` | TypeScript, without emitting files                            |
| `pnpm test`      | Unit tests (Vitest)                                           |
| `pnpm e2e`       | Builds the site, then runs the end-to-end tests (Playwright)  |
| `pnpm check`     | `lint`, `typecheck` and `test` together                       |
| `pnpm format`    | Formats every file with Prettier (`format:check` only checks) |

Inside `apps/web` (`pnpm --filter @virkum/web <script>` from the root):

| Command             | What it does                                                                     |
| ------------------- | -------------------------------------------------------------------------------- |
| `pnpm start`        | Serves `out/` the way Firebase Hosting does, on <http://127.0.0.1:3000/>         |
| `pnpm check:bundle` | Fails if a page loads Three.js up front or its initial JavaScript exceeds 250 KB |
| `pnpm e2e:install`  | Downloads the Playwright browsers (once per machine)                             |

## How the site is organised

```
apps/web/src
├── app/                  Routes only: read the locale, set metadata, compose features
│   ├── (entry)/          "/" → the visitor's language (hosting also 301s it to /is/)
│   ├── (site)/[locale]/  Every page, in both languages: home, sjalfsmat, daemi, namskeid,
│   │                     gervigreind, personuvernd, blogg (+ posts and RSS feeds)
│   ├── global-not-found.tsx, sitemap.ts, robots.ts
├── features/             One folder per page or home section: components, CSS Modules,
│                         logic and its unit tests side by side
├── components/           Site-wide parts: layout (header, footer, page transition),
│                         consent, analytics, navigation, SEO, brand
├── content/              Copy: messages/{is,en}.json and the blog posts
├── config/               Site constants and validated environment variables
├── i18n/                 Locales, routing, typed navigation, request config
├── lib/                  SEO helpers (metadata, JSON-LD, URLs) and small utilities
└── styles/globals.css    Tailwind and the design system
```

- **Copy** lives only in `content/`. Both languages have the same keys (a unit test checks it), and
  the keys are typed, so a missing or misspelled key fails the type check.
- **Design system**: `packages/ui` holds the brand tokens, the shared classes (`.wrap`, `.btn`,
  `.t-*`, scroll reveals) and primitives such as `Columns`, `CutCorner`, `PageHead` and `CountUp`.
  Components style themselves with CSS Modules that read the same tokens.
- **3D**: `packages/basalt` has one engine, a field of hexagonal columns, configured per scene (hero,
  three steps, AI grid, case study, self-assessment, footer skyline). Scenes load on demand, render
  only while on screen, freeze to a still frame for reduced motion, and fall back to flat SVG columns
  without WebGL.

More detail: [docs/architecture.md](docs/architecture.md). How to add pages, copy, posts and scenes:
[CONTRIBUTING.md](CONTRIBUTING.md).

## Quality

- **TypeScript** in strict mode with `noUncheckedIndexedAccess`; **ESLint** with type-aware rules,
  React hooks, Next.js Core Web Vitals and sorted imports; **Prettier** for formatting.
- **Unit tests** (Vitest, Testing Library): self-assessment scoring, blog search, language-switch
  paths, SEO, sitemap, message parity, number and text helpers, 3D math and scene controllers.
- **End-to-end tests** (Playwright): every page in both languages, navigation, the language switch,
  the mobile menu, the self-assessment, blog search, cookie consent and analytics, the 404 page,
  reduced motion and the no-WebGL fallbacks. They run in Chromium, Firefox, WebKit (Safari), Android
  and iPhone emulation, iPad, and a browser with WebGL turned off, plus axe accessibility checks
  (WCAG 2.1 AA) on every page.
- **Bundle check**: Three.js is never part of a page's initial JavaScript, and each page stays under
  a 250 KB gzip budget.
- **Git hooks**: staged files are formatted on commit, and commit messages follow
  [Conventional Commits](https://www.conventionalcommits.org).
- **CI** (`.github/workflows/ci.yml`) runs all of this on every pull request and on `main`. It never
  deploys.

## Hosting

The site is plain static files on Firebase Hosting (`firebase.json`), as virkum.is is today.
[docs/going-live.md](docs/going-live.md) lists the steps to move production to this repository.

## Backend

Not needed yet: the site stores no data and calls no API. When Virkum needs saved results, leads,
client logins or calculators, the plan in [docs/backend-roadmap.md](docs/backend-roadmap.md) adds
them without restructuring.

## Decisions

Architecture decision records are in [docs/adr](docs/adr/README.md).
