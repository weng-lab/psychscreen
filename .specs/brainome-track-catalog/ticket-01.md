# Ticket 01: Add Brainome Track Catalog

**Status:** Reviewed
**Spec:** `./spec.md`
**Requirements:** R1, R2, R3, R4, R5, R6, R7
**Blocked by:** None

## Outcome

Every Psychscreen genome-browser portal offers a valid Brainome CAVE catalog with neurotransmitter and developmental-age browsing views.

## Scope

Add the programmatically generated Brainome catalog, connect it to the shared catalog list, register `caveModule` in runtime and schema registries, regenerate applicable schema output, and add focused automated coverage.

## Acceptance Criteria

- [x] The catalog contains exactly 12 unique tracks covering `GABA` and `GLU` across all six supported ages in chronological order.
- [x] Every entry has the correct CAVE config, human-readable metadata, authored ID, and age color.
- [x] The catalog exposes the approved neurotransmitter and developmental-age views with their specified grouping and leaves.
- [x] `MAIN_TRACK_CATALOGS` includes the Brainome catalog, making it available to all existing portal integrations.
- [x] Portal track stores and TrackSelect schema generation register `caveModule`, and generated schema output is current.
- [x] Focused catalog checks and applicable repository verification pass without regressing or overwriting the reviewed Mukamel work or unrelated changes.

## Verification

Automated checks should cover count and ID uniqueness, the complete Cartesian product and order, metadata humanization, age colors, view definitions, global catalog inclusion, and runtime validation against a registry containing `caveModule`. Run applicable TypeScript, focused lint, and production build checks.

## Starting Points

Use `src/gb-view/catalogs.ts`, `src/gb-view/stores.ts`, `trackselect.config.ts`, and `src/gb-view/schema.json`. Follow the nearby Mukamel catalog pattern. Source configuration, age ordering, and colors are demonstrated in `~/Dev/genomebrowser/packages/v2/test/app/tracks.ts`; CAVE implementation is under `~/Dev/genomebrowser/packages/v2/src/tracks/cave/`.

## Constraints

Preserve the reviewed but uncommitted Mukamel catalog changes and the pre-existing `yalc.lock` modification. Keep catalogs stable and outside React rendering. Do not modify the CAVE package implementation.

## Out of Scope

Do not fix or redesign the CAVE module and do not alter track defaults, persistence, custom modules, or portal-specific behavior beyond globally exposing the catalog.
