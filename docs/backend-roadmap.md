# Backend roadmap

## Do we need a backend now?

No. Everything on virkum.is works without one:

- Copy and blog posts are compiled into the site.
- The self-assessment is scored in the browser, and nothing is stored.
- Blog search runs in the browser.
- Booking goes to Calendly; e-mail links open the visitor's mail app.
- Google Analytics loads in the browser after consent.

A static site is the fastest, cheapest and most secure option until the site has to **store or
protect data**.

## When we will need one

| Need                                                          | What it takes                                |
| ------------------------------------------------------------- | -------------------------------------------- |
| Save self-assessment results or leads, or send them by e-mail | An API endpoint, a database, spam protection |
| Contact or sign-up forms                                      | An API endpoint, e-mail delivery             |
| Calculators that save scenarios or produce reports            | Shared calculation code, an API, a database  |
| Client logins and dashboards                                  | Authentication, a database, a portal app     |
| Editing copy or posts without a developer                     | A headless CMS                               |

## How it fits into this repository

The monorepo already has room for it; nothing needs to move.

```
apps/
  web/        virkum.is (stays static as long as it can)
  portal/     the client app: login, dashboards, saved calculations
packages/
  core/       domain logic and calculations: pure TypeScript, unit-tested, no framework
  db/         database schema, migrations and queries (Drizzle ORM + PostgreSQL)
  ui/         shared design system (already here)
  basalt/     shared 3D scenes (already here)
```

- **`packages/core`** comes first, as soon as a calculation is needed in two places (for example a
  calculator on the site and a report in the portal). Inputs and outputs are validated with zod, so
  the same schema checks a form, an API request and a stored record.
- **`packages/db`**: PostgreSQL on Cloud SQL, in a European region (`europe-west1` or
  `europe-north1`), with Drizzle ORM for typed queries and versioned migrations.
- **`apps/portal`**: a Next.js app with server rendering, deployed with Firebase App Hosting or
  Cloud Run, the Google Cloud stack Virkum already uses. Authentication with Firebase Authentication
  or Identity Platform.
- **Small server features for the public site** (a form endpoint, for example) can run as a Cloud
  Run service or a Firebase Function, without changing the site from a static export.

## Moving the site itself to a server, if ever needed

Only if a public page needs per-request data:

1. Remove `output: "export"` from `apps/web/next.config.ts` and deploy with Firebase App Hosting.
2. Add a Next.js proxy for language detection (next-intl supports it), replacing the hosting
   redirect for `/`.
3. Keep pages static by default (`generateStaticParams`); make only the pages that need it dynamic.

## Data protection

Virkum's clients are in Iceland (EEA), so GDPR applies: store personal data in the EEA, collect only
what is needed, document retention periods, sign data processing agreements with providers, and
update the privacy policy before collecting anything new.
