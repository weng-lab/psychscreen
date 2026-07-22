# Risk-Locus Browser Highlights

**Status:** Ready

## Problem

When a user opens the Brain Epigenome Browser from a disease risk locus, the browser navigates to the selected locus but does not retain the disease's other risk loci as navigable context. The browser-page cytoband is disconnected from the browser store's highlights, so neither disease loci nor highlights created through the highlight dialog appear there or support navigation.

## Desired Outcome

Each disease browser session starts with all risk loci for that disease represented as browser-store highlights. The browser-page cytoband reflects the store's current highlights for the active chromosome, and selecting any displayed highlight navigates the browser to that highlight's focused region.

## Current State

`riskLoci()` produces broad clustering intervals by expanding source variants by 1.5 Mb and merging overlaps. `RiskLocusView` displays those broad intervals but narrows a clicked locus by 1.4 Mb on each side before opening the browser. Disease browser sessions currently accept only an initial region and optional summary-statistics URL. `DomainDisplay` renders the current region in `Cytobands` without subscribing to browser-store highlights, while `HighlightDialog` already reads and mutates those highlights through the same store.

## Requirements

- **R1:** Initialize each disease-trait browser session with one browser-store highlight for every loaded risk locus belonging to the active disease, including the locus used to open the browser.
- **R2:** Every disease risk-locus highlight must include its chromosome and use the focused navigation interval derived from the broad clustering interval as `start + 1,400,000` through `end - 1,400,000`.
- **R3:** The risk-locus overview click and disease highlight generation must use one shared focused-locus conversion so their navigation coordinates cannot drift.
- **R4:** Disease-generated highlight IDs must be deterministic, unique within the session, and namespaced separately from user-authored highlight IDs.
- **R5:** The shared browser session factory must support optional initial highlights and pass them into `createBrowserStore`; session types that do not supply highlights must preserve their current behavior.
- **R6:** `DomainDisplay` must subscribe to the browser store's current highlights and supply them to `Cytobands` together with the active chromosome and current region.
- **R7:** Selecting a cytoband highlight must set the browser region to that highlight's chromosome, start, and end through the browser store's region action.
- **R8:** The cytoband must update reactively when highlights are added or removed through `HighlightDialog`; user-authored highlights must be displayed and navigable under the same behavior as initialized disease highlights.
- **R9:** Cytoband rendering must show only highlights applicable to the active chromosome, relying on `Cytobands` chromosome filtering rather than maintaining a second highlight collection.
- **R10:** Opening the browser from a risk-locus overview click must continue to focus the same region as before this change.
- **R11:** Existing genome-browser highlight overlays, tracks, and disease LD interactions must continue to function when sessions are initialized with disease highlights and when highlight navigation changes the region.

## Technical Decisions

The browser store is the single source of truth for all browser highlights. Disease loci are converted once, before disease session creation, to package `Highlight` values whose regions contain chromosome and focused coordinates. The focused-coordinate conversion is a pure disease-portal helper shared by `RiskLocusView` and disease highlight creation. IDs use a stable disease-risk-locus namespace and encode enough disease and locus identity to prevent collisions with user-created entries.

Initial highlights enter through an optional shared session-factory input and are supplied directly to `createBrowserStore({ highlights })`; they are not held in parallel component state. `DomainDisplay` reads both `state.highlights` and `state.setRegion`, delegates active-chromosome filtering to `Cytobands`, and navigates to the clicked highlight's complete region.

## Verification Strategy

Verify the focused-locus helper returns the established 1.4 Mb inset and is used by both overview navigation and generated highlights. Verify disease session creation seeds all and only the active disease's loci with unique namespaced IDs and chromosome-bearing focused regions, while other session factories remain unchanged.

In browser-level or component-level verification, confirm the cytoband displays disease highlights on the active chromosome, clicking another locus moves to its exact focused region, and changing chromosomes displays that chromosome's loci. Add and remove highlights through `HighlightDialog` and confirm the cytoband updates and user-created highlights navigate correctly. Exercise existing browser overlays and disease summary-statistics/LD behavior after region changes. Run applicable type, lint, and build checks.

## Out of Scope

Changing risk-locus clustering, changing the established focused interval, redesigning the risk-locus overview or highlight dialog, persisting highlights across browser sessions, adding cross-disease highlights, or modifying genomebrowser package cytoband behavior is excluded.

## Risks and Edge Cases

Broad clustering coordinates must never leak into browser navigation, or a cytoband click will zoom out relative to the overview behavior. Disease IDs and user-entered IDs share one store and therefore require a collision-resistant namespace. Initial highlights must be available when the session is created; recreating or reseeding the store after user edits could discard dialog changes. Chromosome changes must not delete off-chromosome highlights, because they must reappear when that chromosome becomes active.

## Amendments

### A001 - Keep disease loci off browser tracks

- **Supersedes:** Desired Outcome; R1, R2, R5, R6, R9, and R11; Technical Decisions; Verification Strategy; Risks and Edge Cases.
- **Replacement:** Disease risk loci are cytoband-only navigation markers and must never be inserted into `browserStore.highlights`, rendered over browser tracks, or listed in `HighlightDialog`. R1: provide one cytoband marker for every loaded risk locus belonging to the active disease, including the selected locus. R2: every disease marker includes its chromosome and focused interval of `start + 1,400,000` through `end - 1,400,000`. R5: pass disease markers separately through the disease browser panel and shared browser view to `DomainDisplay`; disease session factories and `createBrowserStore` must not receive them. R6: `DomainDisplay` combines the separate disease markers with its reactive subscription to user-created `browserStore.highlights` when supplying `Cytobands`. R9: rely on `Cytobands` to filter the combined marker collection for the active chromosome without mutating either source. R11: existing browser overlays, tracks, disease LD interactions, and user-created highlight behavior remain intact; only disease risk-locus markers are excluded from browser overlays and the dialog. The browser store remains the source of truth for user-created highlights, while disease risk-locus markers are immutable disease-session input owned outside the store. Cytoband clicks navigate using the marker region regardless of source. Verify that all disease loci appear and navigate on the cytoband but never overlay track data or appear in the dialog; verify dialog-created highlights remain reactive, navigable on the cytoband, and retain their existing browser behavior. Broad clustering coordinates must not leak into navigation, marker IDs must remain deterministic, and chromosome changes must not discard either source.
- **Reason:** Disease risk-locus overlays obscure track data and are visually distracting; they are useful only as cytoband navigation markers.
