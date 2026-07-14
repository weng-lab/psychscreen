# Core Concepts

The v2 package separates application-owned state, track-type behavior, and browser orchestration. Understanding those three roles is enough for most integrations.

## Stores belong to the application

`createBrowserStore` and `createTrackStore` return Zustand hooks that the application creates and keeps stable.

The browser store owns the visible genomic region, track-area width, margin and typography sizes, zoom behavior, and highlights. The track store owns the registered module set, validated track instances, and their order. Because the stores live outside `GenomeBrowser`, application controls and optional UI-v2 components can use the same state.

`GenomeBrowser` creates short-lived internal state for the mounted browser, including request results and default settings/context-menu state. Unmounting it discards that internal state, but does not discard the application-owned browser or track stores. An application may provide a custom settings store when it needs to replace browser-owned settings UI.

## Modules define track types

A registered module holds stable behavior for one type: schemas, defaults, fetching, renderers, display modes, and optional settings and tooltip components. A track instance holds values for one row:

- `type` chooses the module.
- `base` contains ID, title, display, height, and optional color.
- `config` contains module-specific values such as URLs and visual options.
- `interaction` optionally contains app callbacks for that instance.

Create tracks through `module.create(...)`, then register that same module in the track store. Track IDs and module types must be unique in their respective collections.

## Exact request behavior

On initial mount, the browser requests every track for an overscanned render region around the visible region. A visible-region change targets a new overscanned region and requests every track again.

For a config-only change, the browser requests only that track and only when a field marked by its module with `fetchOnChange` has changed. Base fields, interaction callbacks, display changes, and unmarked config fields re-render without requesting data. This means custom module authors must mark every config field that affects the fetched response.

Each module fetch returns raw data for the requested genomic region. Its selected renderer transforms that data for the current display mode, pixel width, and height.

During panning, existing SVG content moves immediately. Previously successful track data stays visible while the latest request is in flight. The browser settles onto the newest render region only after its track requests finish, and it blocks pointer interactions during mismatched or fetching states. A failed request is shown as a track error; other tracks can still complete.

## Mutation behavior

Static construction fails by throwing: invalid module input, browser-store input, initial tracks, unknown module types, and duplicate IDs cannot produce a valid object.

After a track store exists, expected mutation failures return `{ ok: false, error }` instead. Failed mutations are atomic and leave tracks and order unchanged. Check results from add, remove, reorder, replace, and update actions when the operation comes from user or external input.

Interaction callbacks are functions and are therefore not part of serializable catalog or saved-session JSON. Catalog entries are create input; they become nested runtime instances only after the selected module creates them.

## Public boundary

Application code should use exports from `@weng-lab/genomebrowser-v2`. The ordinary path is `GenomeBrowser`, store factories, and built-in modules. The custom-module path adds `defineTrackModule`, `fetchOnChange`, focused hooks, and module contract types. Files inside the package's `src` tree are implementation details.
