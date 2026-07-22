# Mukamel Track Catalog

**Status:** Ready

## Problem

The genome browser package contains working Mukamel 2024 methylation track definitions and the Psychscreen application already exposes catalog-driven track selection, but the Mukamel tracks are not available through that catalog UI.

## Desired Outcome

Users can select any Mukamel 2024 methylation track from every Psychscreen genome-browser portal, browsing the tracks by either cell type or demographic dimensions.

## Current State

Psychscreen passes `MAIN_TRACK_CATALOGS` to its shared `GenomeBrowserView`, with single-cell portals extending that catalog list. Runtime track stores and the TrackSelect schema configuration currently omit `methylCModule`. The authoritative Mukamel names and deterministic URL convention are demonstrated in `~/Dev/genomebrowser/packages/v2/test/app/tracks.ts`.

## Requirements

- **R1:** Provide a separate Mukamel 2024 TrackSelect catalog containing every Mukamel methylation option currently demonstrated by the genomebrowser v2 test application.
- **R2:** Each entry must create a valid `methylc` track using the demonstrated Watson/Crick CGN, CHN, and coverage URL convention; unavailable CHH channels must remain explicitly empty.
- **R3:** Each entry must expose normalized `cellType`, `sex`, and `age` metadata. Unsuffixed dimensions must be represented as `All`.
- **R4:** Provide a cell-type view grouped by `cellType` then `sex`, with `age` as the leaf, and a demographics view grouped by `sex` then `age`, with `cellType` as the leaf.
- **R5:** Make the Mukamel catalog available through the shared main catalog list so it appears in every portal, including portals that extend the main list.
- **R6:** Register `methylCModule` consistently in portal track stores and TrackSelect schema generation so catalog validation and track creation succeed.

## Technical Decisions

The Mukamel data remains a distinct catalog rather than being folded into the existing Psychscreen catalog. Build the repetitive entries from a canonical cell-type list and the supported aggregate, sex, and age combinations rather than maintaining hundreds of duplicated track objects. Catalogs must be created outside React rendering. Authored track IDs should preserve the source Mukamel names so URL derivation and comparison with the source inventory remain direct.

## Verification Strategy

Verify the generated catalog has the complete, unique source inventory and expected dimension metadata, representative URLs match the v2 example convention, both views reference metadata present on every entry, and the catalog validates against the same module registry used by portal stores. Run the repository's applicable type, lint, and build checks.

## Out of Scope

Persisting user selections, changing default selected tracks, portal-specific visibility, track interactions, and redesigning the TrackSelect UI are excluded.

## Risks and Edge Cases

Catalog schema generation and runtime registration can drift if `methylCModule` is added to only one registry. Programmatic expansion must preserve the exact source naming order and all nine variants per cell type.
