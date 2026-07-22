# Ticket 01: Serve the home page at the domain root

**Status:** Reviewed
**Spec:** `./spec.md`
**Requirements:** R1, R5, R6
**Blocked by:** None

## Outcome

The domain root renders the PsychSCREEN home page directly, and the obsolete Create React App HTML shell no longer competes with Next.js application output.

## Scope

Replace the React Router root redirect with the home page route, remove the now-redundant `/psychscreen` home route, and remove `public/index.html`.

## Acceptance Criteria

- [x] The React Router `/` route renders the PsychSCREEN home page without `Navigate`.
- [x] There is no separate `/psychscreen` home route.
- [x] `public/index.html` is removed.
- [x] TypeScript validation, focused tests, and a production build pass.

## Verification

Inspect the root route contract, run TypeScript validation and focused tests, and run a production Next.js build.

## Starting Points

- `src/App.tsx` owns the client-side route table.
- `app/[[...slug]]/page.tsx` already sends root requests into `AppClient`.
- `public/index.html` is a stale Create React App template and is not the Next.js root document.

## Constraints

Do not add redirects or change routing frameworks. Leave non-home `/psychscreen/...` routes for Ticket 02.

## Out of Scope

Migrating portal and utility routes or their navigation targets.
