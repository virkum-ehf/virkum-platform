# 0002. Static export now, server features later

- Status: Accepted
- Date: 2026-11-15

## Context

virkum.is stores no data and calls no API. The self-assessment and blog search run in the browser,
booking goes to Calendly, and analytics loads after consent. The current site is static files on
Firebase Hosting.

## Decision

Build `apps/web` with Next.js (App Router) and `output: "export"`, deployed as static files on
Firebase Hosting. Keep the code server-ready: server components by default, no browser-only APIs at
module level, and data loading behind functions that could later run on a server.

## Consequences

- Fast, cheap and with almost no attack surface: there is no server to patch or scale.
- No Next.js proxy (middleware): the `/` → `/is/` redirect is a hosting rule, and pages must not
  read cookies or headers.
- When a feature needs a server, it goes into a separate service or app first (see
  `docs/backend-roadmap.md`). Moving the site itself to server rendering means removing the export
  option and deploying with Firebase App Hosting, without rewriting pages.
