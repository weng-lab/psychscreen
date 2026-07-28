# Ticket 03: Restore legacy prefixed URL compatibility

**Status:** Reviewed
**Spec:** `./spec.md`
**Requirements:** R4 as replaced by A001, A002, A003
**Blocked by:** None

## Outcome

Previously shared `/psychscreen` URLs continue to work while unprefixed routes remain canonical throughout first-party navigation.

## Scope

Add compatibility handling for the legacy `/psychscreen` home URL and nested `/psychscreen/...` application URLs, mapping them to their corresponding unprefixed canonical destinations without reverting canonical route declarations or first-party links.

## Acceptance Criteria

- [x] `/psychscreen` resolves to `/`.
- [x] Representative nested legacy URLs resolve to the corresponding unprefixed application routes.
- [x] Legacy URLs preserve path parameters, query strings, and fragments when resolving to their canonical destinations.
- [x] Canonical route declarations and first-party navigation remain unprefixed.
- [x] TypeScript validation, focused compatibility tests, and a production build pass.

## Verification

Exercise the legacy home URL and representative static, portal, and parameterized nested URLs, including query strings and fragments. Confirm canonical navigation remains unprefixed, then run repository-required TypeScript, focused test, and production build checks.

## Starting Points

- `src/App.tsx` owns the client-side route table.
- `app/[[...slug]]/page.tsx` delegates paths to the client application.
- Existing routing tests provide the preferred seam for compatibility behavior.

## Constraints

Unprefixed URLs remain canonical. Do not restore `/psychscreen` in first-party links, navigation calls, or canonical route declarations. Preserve route parameters and route ordering.

## Out of Scope

Replacing React Router, changing unrelated routes, or performing general routing cleanup.
