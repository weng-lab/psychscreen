# Troubleshooting

## `No track module registered for type`

The track's `type` is absent from `createTrackStore({ modules })`. Register the same module before creating initial tracks, adding a track, or passing the store to catalog UI. Module `type` values must also be unique.

## Validation errors or duplicate IDs

Create tracks with `module.create(...)` rather than assembling the nested runtime object by hand. IDs must be non-empty and unique within the store, display must name one of the module's renderers, height must be positive, and config must pass the module's strict Zod schema.

Initial construction throws because no valid store can be returned. After construction, track-store mutations return `{ ok: false, error }` and leave all state unchanged. Check the return value from `addTrack`, `removeTrack`, `applyTrackChanges`, `reorderTracks`, `updateBase`, `updateConfig`, and `updateInteraction`.

## Config changes but data does not refetch

For custom modules, wrap every config schema field that changes the fetched response with `fetchOnChange`. A region change always requests all tracks, but a config-only change requests a track only when its marked-field signature changes.

Do not mark visual-only fields. They should re-render with existing data. If a built-in module does not refetch after changing a documented data-source field, verify that the mutation succeeded before investigating request behavior.

## Network or data failure

Fetch failures appear in the affected track's error state. Check browser network tools for status, CORS, authentication, and response-shape errors. Confirm the URL points to the format expected by the selected module; `YOUR_URL_HERE` in examples is only a placeholder.

The Transcript and LD modules post to `/api/screen-graphql`. The host application must provide that route, forward GraphQL requests to SCREEN, and attach credentials on the server. Do not put SCREEN credentials in the browser bundle.

## Browser is blank, clipped, or too wide

The browser does not measure its parent. Set `trackWidth` to a positive value and update it from a `ResizeObserver` when the container changes. The complete SVG width is `marginWidth + trackWidth`, so subtract the margin from the measured host width if the browser should fit exactly.

Also ensure the host has a real layout width and decide whether narrow containers should resize the browser or allow horizontal scrolling.

## State resets on React renders

Store factories return Zustand hooks. Create them outside ordinary component render or once in a stable initialization boundary. Recreating a browser store resets region and highlights; recreating a track store resets tracks, order, and registry identity; remounting `GenomeBrowser` discards its internal request and overlay state.

## A method threw instead of returning a result

Construction and malformed browser-level input throw: module definition and creation, registry creation, browser-store creation, track-store creation, region parsing, invalid zoom factors, and invalid highlights.

Track-store mutations use result objects for expected runtime failures. Catch thrown errors where dynamic input enters construction or browser methods; branch on `result.ok` for track mutations.

## Client-runtime requirements

Use the package in a React 19 client environment with `react` and `react-dom` installed. Rendering and interaction depend on browser SVG/DOM APIs, pointer events, and network access. Responsive examples additionally use `ResizeObserver`. In SSR frameworks, render the browser from a client-only boundary rather than expecting server-side SVG output.
