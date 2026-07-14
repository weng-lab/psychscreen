# Getting Started

Install the package and its React peer dependencies:

```sh
pnpm add @weng-lab/genomebrowser-v2 react@^19 react-dom@^19
```

The browser needs one stable browser store, one stable track store, and at least one registered module. The application is responsible for measuring the available track width.

## Minimal responsive browser

This example registers the built-in BigWig module, creates one track, and keeps the SVG track area matched to its container. Replace `YOUR_URL_HERE` with a BigWig URL accessible from the browser.

```tsx
import { useEffect, useRef } from "react";
import {
  GenomeBrowser,
  bigWigModule,
  createBrowserStore,
  createTrackStore,
} from "@weng-lab/genomebrowser-v2";

const marginWidth = 120;

const useBrowserStore = createBrowserStore({
  region: "chr1:1000000-1100000",
  marginWidth,
  trackWidth: 880,
});

const useTrackStore = createTrackStore({
  modules: [bigWigModule],
  tracks: [
    bigWigModule.create({
      id: "signal",
      title: "Signal",
      config: { url: "YOUR_URL_HERE" },
    }),
  ],
});

export function BrowserPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const trackWidth = Math.max(1, entry.contentRect.width - marginWidth);
      useBrowserStore.getState().setTrackWidth(trackWidth);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
      <GenomeBrowser browserStore={useBrowserStore} trackStore={useTrackStore} />
    </div>
  );
}
```

Store factory results are Zustand hooks, so local names should begin with `use`. Define them outside the component as above, or create them once in another stable initialization boundary. Recreating either store during render resets browser state and request coordination.

## Updating the browser

Store actions are available through `getState()` outside React. Region methods throw for invalid input; track mutations return a result so expected user-input errors can be displayed.

```ts
useBrowserStore.getState().setRegion("chr1:1200000-1250000");

const result = useTrackStore.getState().updateConfig("signal", {
  url: "YOUR_URL_HERE",
});

if (!result.ok) {
  showError(result.error);
}
```

Changing the region requests all tracks for the new render region. BigWig marks its URL as data-dependent, so changing that URL requests the track again. Invalid updates leave the existing track unchanged.

Next, read [Core concepts](concepts.md) for lifecycle and request semantics, then use [Recipes](recipes.md) for common mutations and navigation.
