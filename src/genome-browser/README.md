# Psychscreen genome browser

The integration uses the coordinated `2.0.0-beta.1` runtime, tracks, and UI packages.

## Layout

- `index.ts` is the portal-facing entry point for the browser view, session factories, and default selections.
- `GenomeBrowserView.tsx` composes the browser and its controls, measuring the container so tracks fit its width without horizontal scrolling.
- `sessions.ts` creates an independent hg38 browser/track store pair for each portal, with a 50-pixel margin and an initial 1250-pixel track width that adjusts to the available space.
- `registry.ts` defines the first-party modules used by sessions and schema generation.
- `collections/` contains the Psychscreen, Mukamel, and Brainome collections, active portal defaults, and generated JSON schema.
- `components/` contains browser search, navigation, and overview controls. Highlight management uses `HighlightDialog` from the UI package, bound to the same browser store.
- Each browser view owns a stable settings store configured with the tracks package's MUI `TrackBaseSettings`, alongside each module's first-party settings panel.
- `highlights.ts` contains the shared highlight helpers.
- `data/` contains shared hg38 cytobands and source attribution.
- `modules/` contains the beta Manhattan, LD, GRN, and QTL modules, including shared BigBed reading and interaction rendering. All modules are included in TypeScript checking.

## Tracks and state

The fixed annotation track uses the first-party `geneModule` with GENCODE v40 comprehensive BigBed annotations in merged mode. Gene search still uses the existing SCREEN proxy and requires a working server-side `SCREEN_API_KEY`; the gene track reads its BigBed directly.

All portals share the same collection inventory: 90 BigWig/BigBed tracks, 261 Mukamel methylation tracks, 12 Brainome CAVE tracks, and six single-cell interaction tracks. Portal defaults determine the initial selection. The disease/trait browser adds host-owned Manhattan and LD tracks from the existing full-summary-statistics URL map. Single-cell details has separate ATAC, GRN, and eQTL browser sessions.

Portal components retain their session in React state so tab changes preserve navigation and track selection. The disease browser owns the LD selection provider and controller, resets selection on navigation, and disposes its subscription/controller on unmount.

## Validation

Run `yarn browser:schema` after changing registered modules and `yarn browser:schema:check` to check the generated schema. The command reads `registry.ts` directly. Run `yarn browser:test` for custom module regressions and `yarn build` to verify the production bundle and TypeScript integration. Schema generation enables Jiti JSX support because the registry imports local TSX modules.
