# Getting Started

Use `GenomeBrowser` when you want to render genomic tracks from a list of registered track modules. The browser owns viewport behavior and orchestration; track modules own track-specific validation, data fetching, rendering, settings, and tooltips.

## Minimal setup

Create the stores outside the browser component render path, then pass them to `GenomeBrowser`.

> These stores are hooks and must include "use" at the beginning of the variable name. And be defined outside of a function.

```tsx
import {
  GenomeBrowser,
  bigWigModule,
  createBrowserStore,
  createTrackStore,
} from "@weng-lab/genomebrowser-v2";

const useBrowserStore = createBrowserStore({
  region: "chr1:1000000-1100000",
  trackWidth: 1000,
});

const useTrackStore = createTrackStore({
  modules: [bigWigModule],
  tracks: [
    bigWigModule.create({
      id: "signal",
      title: "Signal",
      display: "full",
      config: { url: "YOUR_URL_HERE" },
    }),
  ],
});

export function BrowserPage() {
  return (
    <GenomeBrowser browserStore={useBrowserStore} trackStore={useTrackStore} />
  );
}
```

## What the stores own

- `createBrowserStore` owns the current region, layout dimensions, zooming, and highlights.
- `createTrackStore` owns registered modules, track instances, ordering, and track mutations.
- `GenomeBrowser` composes the stores, fetches data for the current render window, and renders tracks.

## Defaults to know

`createBrowserStore` defaults `marginWidth` to `120`, `trackWidth` to `1000`, `fontSize` to `10`, and `titleSize` to `12`. Individual track modules provide their own default height, color, and display behavior.

## Sharp edges

Track IDs must be unique. The track store validates every track against the registered module for that track's `type`, so adding a track for an unregistered module or with an invalid config returns an error or throws during initial store creation.
