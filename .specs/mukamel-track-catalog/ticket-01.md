# Ticket 01: Add Mukamel Track Catalog

**Status:** Reviewed
**Spec:** `./spec.md`
**Requirements:** R1, R2, R3, R4, R5, R6
**Blocked by:** None

## Outcome

Every Psychscreen genome-browser portal offers a valid Mukamel 2024 methylation catalog with cell-type and demographic browsing views.

## Scope

Add the programmatically generated Mukamel catalog, connect it to the shared catalog list, register the methylation module in runtime and schema registries, regenerate applicable schema output, and add focused automated coverage for catalog completeness and representative configuration.

## Acceptance Criteria

- [x] The catalog contains the exact 261 Mukamel source options represented by 29 cell types and nine aggregate/demographic variants, with unique authored IDs.
- [x] Every entry has correct `cellType`, `sex`, and `age` metadata and a valid methylC configuration following the source URL convention.
- [x] The catalog exposes the approved cell-type and demographics views with their specified grouping and leaves.
- [x] `MAIN_TRACK_CATALOGS` includes the Mukamel catalog, making it available to all existing portal integrations.
- [x] Portal track stores and TrackSelect schema generation register `methylCModule`, and generated schema output is current.
- [x] Focused catalog checks and applicable repository-wide verification pass without modifying unrelated work.

## Verification

Automated checks should cover count and ID uniqueness, all nine variants for at least one cell type, normalized metadata including aggregate values, representative Watson/Crick and empty CHH URLs, view definitions, and runtime validation against a registry containing `methylCModule`. Run applicable TypeScript, lint, and production build checks.

## Starting Points

Use `src/gb-view/catalogs.ts`, `src/gb-view/stores.ts`, `trackselect.config.ts`, and the generated `src/gb-view/schema.json`. The source inventory and URL convention are in `~/Dev/genomebrowser/packages/v2/test/app/tracks.ts`. Package behavior is documented under each installed genomebrowser package's `docs/` directory.

## Constraints

Preserve the pre-existing `yalc.lock` modification. Keep catalogs stable and outside React rendering. Runtime stores, schema tooling, and catalog track types must use aligned module sets.

## Out of Scope

Do not alter defaults, persistence, existing custom modules, or portal-specific behavior beyond globally exposing the new catalog.
