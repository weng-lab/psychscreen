# Brainome Track Catalog

**Status:** Ready

## Problem

The genomebrowser v2 package contains a CAVE module configured for Brainome developmental methylation datasets, but those available configurations cannot currently be selected from Psychscreen's catalog-driven track UI.

## Desired Outcome

Users can select any supported Brainome CAVE track from every Psychscreen genome-browser portal and browse the tracks by neurotransmitter or developmental age.

## Current State

The package-defined `caveModule` accepts `GABA` or `GLU` and six ordered developmental ages. It derives the paired hmC and OXBS dataset URLs internally. Psychscreen already exposes shared TrackSelect catalogs and has an in-review Mukamel catalog change that established programmatic catalog generation and aligned runtime/schema module registries.

## Requirements

- **R1:** Provide a separate Brainome TrackSelect catalog containing all 12 supported CAVE configurations: two neurotransmitters across six developmental ages.
- **R2:** Each catalog entry must create a valid `cave` track with the correct package-supported `neurotransmitter` and age enum values.
- **R3:** Each entry must expose neurotransmitter and human-readable developmental-age metadata while preserving chronological age order.
- **R4:** Provide a neurotransmitter view grouped by `neurotransmitter` with developmental age as the leaf, and a developmental-age view grouped by age with neurotransmitter as the leaf.
- **R5:** Apply the age color palette demonstrated by the genomebrowser v2 test application consistently to both neurotransmitters.
- **R6:** Include the Brainome catalog in `MAIN_TRACK_CATALOGS` so it is available in every portal, including portals extending the main catalogs.
- **R7:** Register `caveModule` consistently in portal track stores and TrackSelect schema generation so catalog validation and track creation succeed.

## Technical Decisions

Generate the 12 entries at module scope from canonical neurotransmitter and age definitions rather than authoring repetitive JSON. Authored IDs use `<neurotransmitter>.<age-enum>`. Keep the package enum value in track configuration and provide a separately humanized age label in metadata. The catalog accepts the current CAVE renderer and package-owned dataset URL behavior without modifying them.

## Verification Strategy

Verify the catalog contains 12 unique entries, every neurotransmitter/age combination exists in chronological order, metadata and colors are correct, both views use fields present on every track, and the catalog validates against a registry containing `caveModule`. Verify global catalog integration and runtime/schema registry alignment. Run applicable type, lint, and build checks.

## Out of Scope

Changes to CAVE fetching, rendering, interactions, settings, package exports, hard-coded dataset ownership, selection persistence, defaults, or portal-specific visibility are excluded.

## Risks and Edge Cases

The package records known CAVE renderer and API-surface debt. This catalog intentionally exposes the current behavior; correcting that debt remains separate work. Schema tooling and runtime registration must remain aligned.
