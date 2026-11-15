# 0004. Typed copy with next-intl and language-prefixed URLs

- Status: Accepted
- Date: 2026-11-15

## Context

The site is Icelandic first, with a full English version. Today's URLs (`/is/…`, `/en/…`) are indexed
and must not change.

## Decision

Use next-intl with `localePrefix: "always"`, Icelandic as the default. All copy lives in
`content/messages/{is,en}.json`; the message type is derived from `is.json`. A unit test keeps both
files in step. Client components receive only the namespaces they use.

## Consequences

- A missing or misspelled message key is a type error, and a missing translation fails the tests.
- URLs stay identical to the current site, with `hreflang` alternates on every page.
- Without a server there is no automatic language detection; the visitor's choice is remembered in
  the browser and used for `/` when the host does not redirect.
