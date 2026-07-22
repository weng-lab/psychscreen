# Ticket 01: Seed Disease Risk-Locus Highlights

**Status:** Reviewed
**Spec:** `./spec.md`
**Requirements:** R1, R2, R3, R4, R5, R10, R11
**Blocked by:** None

## Outcome

Each disease-trait browser store starts with all loci for the active disease represented as stable, chromosome-bearing highlights at the same focused coordinates used by risk-locus overview navigation.

## Scope

Extract the established risk-locus focus conversion into a shared pure helper, use it for overview clicks and disease highlight generation, pass the generated highlights through `DiseaseTraitBrowserPanel`, and extend the shared browser-session factory to seed optional initial highlights into `createBrowserStore`.

## Acceptance Criteria

- [x] One shared helper converts a broad risk locus to `start + 1,400,000` and `end - 1,400,000`, preserving its chromosome.
- [x] `RiskLocusView` uses the shared helper and opening a clicked locus retains its existing focused region.
- [x] The active disease's complete loaded locus collection is converted to browser highlights before its browser session is created.
- [x] Each generated highlight has a chromosome-bearing focused region and a deterministic ID in a disease-risk-locus namespace that is unique within the session.
- [x] `createDiseaseTraitBrowserSession` accepts the initial highlights and the shared factory passes them to `createBrowserStore` without maintaining a second highlight state.
- [x] Gene and single-cell session creation remains compatible when no initial highlights are supplied.
- [x] Existing disease tracks, browser overlays, summary-statistics behavior, and LD setup remain intact.

## Verification

Add focused automated coverage where practical for the pure coordinate conversion, generated highlight regions and ID uniqueness, and browser-store initialization. Confirm an overview click and its corresponding initialized highlight have identical focused coordinates. Run applicable type, lint, and build checks and exercise disease session creation with and without summary statistics.

## Starting Points

Use `src/web/Portals/DiseaseTraitPortal/utils.ts`, `RiskLoci.tsx`, and `DiseaseTraitDetails.tsx`, plus `src/gb-view/stores.ts`. `riskLoci()` deliberately returns broad 1.5 Mb-expanded clustering intervals; `RiskLocusView` currently applies the established 1.4 Mb inset at click time. `DiseaseTraitBrowserPanel` creates its session once, so highlights must be available in that initializer rather than reseeded after dialog edits.

## Constraints

The browser store remains the only highlight owner. Preserve the current default browser-region behavior unless changing it is strictly necessary to satisfy the spec. Preserve unrelated worktree changes, including catalog work and `yalc.lock` if present.

## Out of Scope

Do not change risk-locus clustering, the focused inset, highlight persistence, the highlight dialog, cytoband behavior, or non-disease session defaults.

## Amendments

### A001 - Produce cytoband-only disease markers

- **Supersedes:** Outcome; Scope; Acceptance Criteria; Verification; Constraints; Out of Scope.
- **Replacement:** Outcome: the active disease has a complete deterministic collection of chromosome-bearing, focused cytoband markers without seeding those markers into the browser store. Scope: retain the shared 1.4 Mb focus helper and disease marker generation, but remove disease marker initialization from `DiseaseTraitBrowserPanel`, `createDiseaseTraitBrowserSession`, the shared session factory, and `createBrowserStore`; leave the generated collection available for Ticket 02's explicit cytoband prop path. Acceptance Criteria: (1) the shared helper preserves chromosome and applies the exact established inset; (2) overview clicks use the helper and retain existing navigation; (3) all active-disease loci produce deterministic, unique, namespaced markers at focused coordinates; (4) no disease risk-locus marker is inserted into `browserStore.highlights`; (5) disease, gene, and single-cell session signatures and behavior remain compatible without initial disease markers; (6) existing tracks, overlays, summary-statistics behavior, and LD setup remain intact. Verification: cover helper and marker generation, prove disease session stores are not seeded with risk loci, and run applicable type, lint, focused test, and build checks. Constraints: disease markers are immutable cytoband input rather than browser-store state; preserve unrelated worktree changes and do not alter clustering, the inset, dialog behavior, non-disease defaults, or `DomainDisplay` behavior owned by Ticket 02.
- **Reason:** Disease overlays obscure browser track data; the loci should be navigation markers only.
