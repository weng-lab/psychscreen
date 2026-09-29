# Psychscreen genome browser

The integration uses version `2.0.0` of the runtime, tracks, and genomic-reader packages, and version `2.0.1` of the UI package.

## Layout

- `index.ts` is the portal-facing entry point for the browser view, session factories, and default selections.
- `GenomeBrowserView.tsx` composes the browser and its controls, measuring the container so tracks fit its width without horizontal scrolling. Browser tabs use the shared width from `layout.ts`, with 16-pixel mobile gutters and 32-pixel desktop gutters. Portal headings, descriptions, search fields, and tabs use a separate centered content width, so only the browser expands.
- `sessions.ts` creates an independent hg38 browser/track store pair for each portal, with a 50-pixel margin and an initial 1250-pixel track width that adjusts to the available space.
- `registry.ts` defines the first-party modules used by sessions and schema generation.
- `collections/` contains one file per track-selector card (PsychSCREEN cCRE Atlas, Adult Cortex Aging & Sex, Postnatal Neuronal Methylome Development, and Single-Cell Regulatory Interactions), active portal defaults, and generated JSON schema.
- `components/` uses the shared `ControlToolbar` for search, navigation, interaction modes, and management buttons, followed by a full-width chromosome overview. Highlight management uses `HighlightDialog` from the UI package, bound to the same browser store.
- Each module owns its complete settings form. Custom modules include the tracks package's MUI `TrackBaseSettings` alongside their source and display-specific controls.
- `highlights.ts` contains the shared highlight helpers.
- `data/` contains shared hg38 cytobands and source attribution.
- `modules/` contains the custom Manhattan, LD, GRN, and QTL modules, including shared BigBed reading and interaction rendering. All modules are included in TypeScript checking.

## Tracks and state

Track creation and collection entries separate shared properties into `base` and module options into `config`. Collections declare the `hg38` assembly and use core's shared collection schema. BigBed sources select their file format explicitly: BED4 for brain cCREs, BED3 for ATAC peaks, and the cCRE schema for ENCODE cCREs.

Every browser pins the first-party ruler track at the top, followed by the gene track. The annotation track uses the first-party `geneModule` with GENCODE v40 comprehensive BigBed annotations in merged mode. Gene search still uses the existing SCREEN proxy and requires a working server-side `SCREEN_API_KEY`; the gene track reads its BigBed directly.

All portals share the same collection inventory: 90 PsychSCREEN BigWig/BigBed tracks, 261 adult cortex methylation tracks, 12 postnatal 5hmC/5mC CAVE tracks, and six single-cell interaction tracks. Track titles follow `[cell population] · [stage/region] · [condition] · [signal]`, omitting fields shared by the whole card; each card description ends with its citation. Track and collection IDs are stable and are not changed when display labels change. Portal defaults determine the initial selection. The disease/trait browser adds host-owned Manhattan and LD tracks from the existing full-summary-statistics URL map. Single-cell details has separate ATAC, GRN, and eQTL browser sessions.

Portal components retain their session in React state so tab changes preserve navigation and track selection. The disease browser owns the LD selection provider and controller, resets selection on navigation, and disposes its subscription/controller on unmount.

## Validation

Run `yarn browser:schema` after changing registered modules and `yarn browser:schema:check` to check the generated schema. The command reads `registry.ts` directly. Run `yarn browser:test` for custom module regressions and `yarn build` to verify the production bundle and TypeScript integration. Schema generation enables Jiti JSX support because the registry imports local TSX modules.
