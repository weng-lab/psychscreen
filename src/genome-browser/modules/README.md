# Custom beta tracks

## Shared implementation

GRN and QTL retain their collection module IDs, but use `createInteractionModule` with a row parser and color. Both return `GenomicInteraction[]` to the same renderer. Tooltips show endpoint roles, genes, and TFs when present; they do not branch on track type. Format-specific parsers share coordinate validation. All row parsers return an item or `undefined`; `parseRows` skips invalid records and reports one count per batch. This changes GWAS parsing from failing the entire batch to preserving valid rows.

Manhattan and LD share the GWAS reader, but retain separate renderers. LD's GraphQL reader is in `ld/fetchRelationships.ts`, and can be injected into the interaction controller for testing.

## LD selection ownership

Create one `createLDSelectionStore()` per linked Manhattan/LD pair, retain it with that browser session, and wrap its LD renderer/browser subtree in `<LDSelectionProvider value={selectionStore}>`. Pass that same store to `attachLDInteractions` along with the two track IDs. Separate browser sessions/pairs must not share a store. The provider is required; a missing provider raises an explicit error.

The controller owns hover/pin transitions, cancellation, and relationship caching, and publishes render state to the store. The renderer subscribes to that state without keeping another hover/pin copy. LD config now contains only `url`; transient anchors, relationship IDs, and pins are not saved as track configuration. GRN/QTL selection stays renderer-local because it does not coordinate tracks. Call the controller's `reset()` when resetting a session and `dispose()` when tearing it down; disposed callbacks ignore further events.

## Regression checks

Run `yarn browser:test` to exercise parsing, malformed-row diagnostics, LD race handling, pin restoration, reset/disposal, and visible connection filtering. The harness transpiles local TypeScript, loads the installed beta runtime, and injects reader/network boundaries. Module registration, creation, fetch contexts, parsing, and selection behavior are covered. Normal application TypeScript and build checks include every module.

Manhattan renders the source −log10(P) scores and shows both score and P in its tooltip. Its editable `pValueThreshold` defaults to 5e-8; the dotted line is positioned at −log10(threshold). Automatic Y bounds start at zero and include the threshold, while explicit bounds are respected. Within an LD provider, Manhattan highlights and labels the shared active SNP; standalone Manhattan tracks still work without a provider.

All custom settings compose the tracks package’s shared MUI settings controls. Source fields are disabled for host-owned tracks; Manhattan additionally uses the shared independent range and validated numeric fields. Every tooltip composes `TrackTooltip` with the package’s coordinate and signal formatters, preserving track colors and domain-specific content.

The disease panel resets its development session on Fast Refresh so schema edits do not leave the retained track store validating against an older module.
