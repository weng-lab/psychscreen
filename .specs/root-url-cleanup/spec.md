# Root URL Cleanup

**Status:** Ready

## Problem

PsychSCREEN treats `/psychscreen` as an application-wide URL prefix even though the application is deployed at the domain root. The base URL relies on a client-side redirect, and an obsolete Create React App HTML shell remains in `public/`, making root deployment behavior unnecessarily fragile and confusing.

## Desired Outcome

PsychSCREEN is served directly from `/`, with all application routes and first-party navigation using unprefixed URLs.

## Current State

The Next.js App Router delegates application paths to a client-only React Router application. `src/App.tsx` redirects `/` to `/psychscreen` and defines every application route beneath that prefix. Navigation targets are hard-coded across home and portal components. `public/index.html` is an unused Create React App shell containing the “enable JavaScript” fallback.

## Requirements

- **R1:** Visiting `/` renders the PsychSCREEN home page without a client-side redirect.
- **R2:** Application pages use root-relative canonical routes such as `/gene`, `/traits`, `/snp`, `/single-cell`, `/downloads`, and `/aboutus`.
- **R3:** First-party links, navigation calls, and autocomplete targets use the unprefixed canonical routes.
- **R4:** Runtime application source and configuration contain no `/psychscreen` route prefix or compatibility redirects for it.
- **R5:** The obsolete `public/index.html` Create React App shell is removed so Next.js exclusively owns application HTML.
- **R6:** The migrated application passes TypeScript validation, focused application tests, and a production Next.js build.

## Technical Decisions

The domain root is the sole canonical home URL. Existing `/psychscreen` URLs are intentionally not preserved through redirects or duplicate route definitions. React Router continues to own in-application routing beneath the Next.js catch-all route; this effort changes route paths, not routing frameworks.

## Verification Strategy

Verify the root route renders the home page directly, inspect application source for any remaining `/psychscreen` literals, exercise representative navigation targets, run TypeScript and focused tests, and produce a successful Next.js production build.

## Out of Scope

- Vercel Deployment Protection and domain access settings.
- Replacing React Router with Next.js routing.
- General lint remediation unrelated to URL paths.
- Redirects or compatibility behavior for historical `/psychscreen` URLs.

## Risks and Edge Cases

Hard-coded paths are distributed across route declarations, links, grid cells, and autocomplete targets. Missing one can produce navigation that works initially but fails from a specific portal. Route ordering must continue to prevent generic parameter routes from shadowing more specific paths.

## Amendments

### A001 - Preserve legacy prefixed URLs

- **Supersedes:** Requirement R4.
- **Replacement:** Runtime application source and configuration use unprefixed routes as canonical URLs while preserving `/psychscreen` and `/psychscreen/...` legacy URLs through compatibility routing that retains the corresponding destination, path parameters, query string, and fragment.
- **Reason:** Existing references and previously shared URLs must remain functional.

### A002 - Compatibility routing decision

- **Supersedes:** The Technical Decisions statement that existing `/psychscreen` URLs are intentionally not preserved through redirects or duplicate route definitions.
- **Replacement:** The domain root and unprefixed application routes remain canonical. Legacy `/psychscreen` URLs are compatibility entry points and must resolve to their corresponding canonical unprefixed URLs without restoring prefixed first-party navigation.

### A003 - Compatibility scope

- **Supersedes:** The Out of Scope item excluding redirects or compatibility behavior for historical `/psychscreen` URLs.
- **Replacement:** Compatibility behavior for historical `/psychscreen` URLs is in scope; unrelated routing-framework changes remain out of scope.
