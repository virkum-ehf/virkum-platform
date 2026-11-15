# 0006. Testing pyramid with a browser matrix and budgets

- Status: Accepted
- Date: 2026-11-15

## Context

The site is highly interactive (3D scenes, pinned scroll stories, a quiz, live search) and must work
on phones, tablets and desktops, in Safari as well as Chrome and Firefox, with and without WebGL.

## Decision

- Unit tests (Vitest) for logic: scoring, search, paths, SEO, message parity, 3D math and controllers.
- End-to-end tests (Playwright) against the built static site, served like Firebase Hosting: every page
  in both languages and the main user flows, in Chromium, Firefox, WebKit, Android and iPhone
  emulation, iPad and a no-WebGL browser.
- Accessibility checks with axe (WCAG 2.1 AA) on every page.
- Budgets in CI: no Three.js in initial JavaScript, at most 250 KB gzip of initial JavaScript per page,
  no console errors, no sideways scrolling, no broken images.

## Consequences

- Regressions in Safari, on phones or without WebGL are caught before review.
- The end-to-end suite needs the build output, so CI builds once and shares it with the browser jobs.
- Visual changes are still reviewed by people; screenshot tests can be added later if the design
  stabilises.
