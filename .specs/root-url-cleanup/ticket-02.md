# Ticket 02: Remove the application URL prefix

**Status:** Ready
**Spec:** `./spec.md`
**Requirements:** R2, R3, R4, R6
**Blocked by:** None

## Outcome

All PsychSCREEN pages and first-party navigation use root-relative URLs without the `/psychscreen` prefix.

## Scope

Migrate the React Router route table and every first-party link, navigation call, and autocomplete target from `/psychscreen/...` to its unprefixed equivalent. Establish verification that no runtime prefix literals remain.

## Acceptance Criteria

- [ ] Every application route is defined without the `/psychscreen` prefix.
- [ ] Every first-party link, navigation call, and autocomplete target points to an unprefixed route.
- [ ] Runtime source and configuration contain no `/psychscreen` path literal or compatibility redirect.
- [ ] Representative home, portal, detail, and cross-portal navigation paths retain their intended destination.
- [ ] TypeScript validation, focused tests, and a production build pass.

## Verification

Search runtime source and configuration for stale prefix literals, inspect representative route producers and consumers, run TypeScript validation and focused tests, and run a production Next.js build.

## Starting Points

- `src/App.tsx` defines the route table and `PORTALS` composition.
- Home page panels, the app bar, and footer contain primary navigation targets.
- Portal detail views, autocomplete components, and linked grid cells contain contextual navigation targets.

## Constraints

Do not add redirects, aliases, duplicate legacy routes, or an application base path. Preserve route ordering and parameter semantics.

## Out of Scope

General routing refactors, link-component standardization, and unrelated lint cleanup.
