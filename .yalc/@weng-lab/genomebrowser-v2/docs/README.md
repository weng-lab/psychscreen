# @weng-lab/genomebrowser-v2

`@weng-lab/genomebrowser-v2` is a React runtime for displaying genomic tracks. It provides the browser viewport, validated Zustand stores, first-party track modules, and an extension API for custom track types.

Install the package with its React peer dependencies:

```sh
pnpm add @weng-lab/genomebrowser-v2 react@^19 react-dom@^19
```

The package is intended for client-side React 19 applications. Its browser uses SVG, pointer events, `ResizeObserver` in responsive integrations, and remote data requests. It is not a server-rendered visualization runtime.

## v2 and UI-v2

`@weng-lab/genomebrowser-v2` renders and manages the browser itself. `@weng-lab/genomebrowser-ui-v2` is a separate optional package for higher-level application UI such as catalog-backed track selection. Both can share the same v2 track store; installing the UI package is not required to render a browser.

## Recommended API

Most applications need a small surface:

- `createBrowserStore` for region, dimensions, zoom, and highlights
- `createTrackStore` for registered modules and validated track instances
- one or more built-in modules, such as `bigWigModule`
- `GenomeBrowser` to render those stores

Create the stores once, outside ordinary component render, and pass the same track store to any companion UI. Module authors additionally use `defineTrackModule`, `fetchOnChange`, focused renderer hooks, and exported module types. Internal package paths are not public API.

## Learning path

- [Getting started](gettingStarted.md): install, create stable stores, render responsively, and update state.
- [Core concepts](concepts.md): state ownership, request behavior, and interaction lifetimes.
- [Recipes](recipes.md): common track, navigation, highlight, sizing, and UI-v2 tasks.
- [Tracks](tracks.md): the concise current built-in module inventory.
- [Custom track modules](customTrackModules.md): add a validated fetch/render type.
- [Troubleshooting](troubleshooting.md): diagnose setup, validation, request, and sizing failures.

These docs ship with the package and are self-contained.
