# Ticket 02: Connect Cytobands to Browser Highlights

**Status:** Reviewed
**Spec:** `./spec.md`
**Requirements:** R6, R7, R8, R9, R11
**Blocked by:** Ticket 01

## Outcome

The browser-page cytoband reactively displays the browser store's highlights for the active chromosome and navigates to any selected disease or user-created highlight.

## Scope

Connect `DomainDisplay` to the browser store's highlights and region action, pass the store highlights to `Cytobands`, and handle highlight selection by setting the browser to the clicked highlight's complete region.

## Acceptance Criteria

- [ ] `DomainDisplay` subscribes to `state.highlights` and passes that collection directly to `Cytobands` without component-owned or duplicated highlight state.
- [ ] The cytoband continues to receive the active chromosome and current browser region, relying on `Cytobands` to display only highlights for that chromosome.
- [ ] Clicking a cytoband highlight sets the browser region to the highlight's chromosome, start, and end through the browser store's `setRegion` action.
- [ ] Highlights added through `HighlightDialog` appear on the applicable chromosome and are clickable without reopening or recreating the browser session.
- [ ] Highlights removed through `HighlightDialog` disappear reactively from the cytoband while off-chromosome highlights remain in the store and reappear when their chromosome becomes active.
- [ ] Existing browser highlight overlays and region display behavior remain intact.

## Verification

Use focused component or browser-level verification to observe initial and user-created highlights, highlight-click navigation, add/remove reactivity, and chromosome changes. Confirm the complete clicked region is used and that no filtering mutates or drops the store collection. Run applicable type, lint, and build checks.

## Starting Points

Use `src/gb-view/components/DomainDisplay.tsx` and the existing store subscriptions in `src/gb-view/components/HighlightDialog.tsx`. The installed `Cytobands` API accepts `highlights` and `onHighlightClick`; browser highlights carry their navigation region, and the browser store exposes `setRegion`.

## Constraints

The browser store is the single source of truth. Delegate active-chromosome filtering to `Cytobands` and use the settled browser-store region action for navigation. Preserve unrelated worktree changes.

## Out of Scope

Do not redesign `DomainDisplay` or `HighlightDialog`, add custom cytoband filtering or persistence, or modify the genomebrowser packages.

## Amendments

### A001 - Combine cytoband-only disease markers with user highlights

- **Supersedes:** Outcome; Scope; Acceptance Criteria; Verification; Starting Points; Constraints; Out of Scope.
- **Replacement:** Outcome: the browser-page cytoband combines immutable disease risk-locus markers with reactive user-created browser-store highlights, while disease markers never render over tracks or appear in `HighlightDialog`. Scope: add an explicit optional cytoband-marker prop path from `DiseaseTraitBrowserPanel` through `GenomeBrowserView` to `DomainDisplay`; subscribe to browser-store highlights in `DomainDisplay`, combine both sources only for `Cytobands`, and navigate any clicked marker through the store's `setRegion`. Acceptance Criteria: (1) every active-disease marker reaches `Cytobands` through props and is absent from `browserStore.highlights`; (2) `DomainDisplay` reactively subscribes to user highlights and supplies both sources to `Cytobands` without mutating or storing the combined collection; (3) `Cytobands` receives the active chromosome/current region and owns chromosome filtering; (4) clicking either source navigates to the complete chromosome/start/end region; (5) dialog add/remove updates the cytoband without affecting disease markers; (6) disease markers do not overlay tracks or appear in the dialog, while user-created highlights retain existing browser overlay/dialog behavior; (7) browser region display, tracks, overlays, and LD behavior remain intact. Verification: exercise both marker sources, chromosome changes, clicks, dialog reactivity, and absence of disease markers from the store/track overlays; run applicable type, lint, focused test, and build checks. Starting points: `DiseaseTraitDetails.tsx`, `GenomeBrowserView.tsx`, `DomainDisplay.tsx`, and `HighlightDialog.tsx`; use package `Highlight` values as the shared cytoband shape but do not use the browser store for disease markers. Constraints: maintain two explicit owners—immutable disease-session markers via props and mutable user highlights via browser store—and combine them only at the cytoband boundary. Do not modify genomebrowser packages, persistence, clustering, or dialog design.
- **Reason:** Only the cytoband needs disease loci; browser-track overlays are distracting.
