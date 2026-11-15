# 0001. One monorepo with pnpm workspaces and Turborepo

- Status: Accepted
- Date: 2026-11-15

## Context

Virkum expects to build more than a marketing site: client logins, dashboards, calculators and,
eventually, a backend. The website already contains two parts that other apps will want: the design
system and the 3D basalt scenes. Copying them between repositories would let them drift apart.

## Decision

One repository with `apps/*` (deployable applications) and `packages/*` (shared code), managed with
pnpm workspaces and Turborepo. Packages are private, ship TypeScript source and expose explicit entry
points. pnpm is pinned through the `packageManager` field and Corepack.

## Consequences

- Shared code changes in one pull request with every app that uses it, checked by one CI run.
- Turborepo caches lint, type-check, test and build results per package.
- Package boundaries are enforced by `exports`: an app cannot import a package's internals.
- Contributors need pnpm (Corepack provides it) instead of npm.
