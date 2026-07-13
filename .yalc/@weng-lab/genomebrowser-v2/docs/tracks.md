# Tracks

Tracks are created by modules. A track instance has a shared base shape plus module-specific config and optional interaction callbacks.

## Shared track fields

Most module `create` helpers accept these shared fields:

- `id`: unique track ID
- `title`: label shown in the browser margin
- `display`: renderer mode for the module
- `height`: track height in pixels
- `color`: optional module-specific color

Modules may provide defaults for `display`, `height`, and `color`. Module-owned config defaults come from the module's Zod `configSchema`.

## Built-in modules

`@weng-lab/genomebrowser-v2` currently exports these first-party modules:

- `bigWigModule` for BigWig signal data
- `bigBedModule` for BigBed interval data
- `bulkBedModule` for multiple BigBed datasets in one track
- `transcriptModule` for transcript models
- `methylCModule` for methylation signal tracks
- `caveModule` for CAVE data tracks

Register only the modules your browser needs:

```ts
import { bigBedModule, bigWigModule, createTrackStore } from "@weng-lab/genomebrowser-v2";

const useTrackStore = createTrackStore({
  modules: [bigWigModule, bigBedModule],
  tracks: [
    bigWigModule.create({
      id: "signal",
      title: "Signal",
      config: { url: "YOUR_URL_HERE" },
    }),
  ],
});
```

## Interaction callbacks

Track modules may support `onClick`, `onHover`, and `onLeave` callbacks. The callback item shape is module-specific, so use the exported module types when you need strong typing.

```ts
bigWigModule.create(
  {
    id: "signal",
    title: "Signal",
    config: { url: "YOUR_URL_HERE" },
  },
  {
    onHover: (point) => {
      console.log(point.max);
    },
  },
);
```

## Sharp edges

The track store validates a track by looking up `track.type` in the registered modules. If a track's module is not registered, the track cannot be used. Duplicate track IDs are rejected because ordering, updates, settings, and removal are all keyed by ID.
