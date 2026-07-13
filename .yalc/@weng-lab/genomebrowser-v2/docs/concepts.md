# Core Concepts

The v2 package is organized around a narrow browser runtime and self-contained track modules. The browser should know how to pan, zoom, arrange tracks, and coordinate data loading; modules should know how one track type is configured, fetched, rendered, and edited.

## Browser store

The browser store owns browser-level state: the current genomic region, layout sizes, zoom behavior, and highlights. It accepts a region string such as `chr1:1000000-1100000` or a region object.

Store instances returned by `createBrowserStore`, `createTrackStore`, and `createSettingsStore` are Zustand hooks. Name local variables with a `use` prefix, such as `useBrowserStore` and `useTrackStore`, even when passing them to props named `browserStore` or `trackStore`.

Changing the region is browser-level state. Tracks react to that change through module fetch functions rather than directly controlling the browser viewport.

## Track store

The track store owns track instances and the module registry. It validates tracks through their registered module before adding or updating them.

Track mutations return `{ ok: true }` or `{ ok: false, error }`. Treat mutation failures as user-visible configuration errors rather than silent no-ops.

## Track modules

A track module defines one track type. It provides:

- a `type` string used by track instances
- runtime schemas for creation and validation
- a `create` helper for user input
- a `fetch` function for region-specific data
- renderers keyed by display mode
- optional settings and tooltip components

The same module contract is used by first-party modules and custom modules.

## Fetch and render flow

When the region or track config changes, the browser asks each module to fetch data for the active render region. The module returns raw region data, and the browser passes that data to the selected renderer.

Panning uses an overscanned render window. During unsettled movement, interactions can be gated so click and hover behavior does not fire against stale visual state.

## Public boundary

Prefer public exports from `@weng-lab/genomebrowser-v2`: `GenomeBrowser`, store factories, built-in modules, module-author helpers, and exported types. Avoid importing package internals by file path; those files are implementation details and may move.
