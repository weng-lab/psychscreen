# Recipes

These recipes assume stable `useBrowserStore` and `useTrackStore` hooks created as shown in [Getting started](gettingStarted.md).

## Add, remove, reorder, and update tracks

Create a track through its module, then check the store mutation result:

```ts
const nextTrack = bigWigModule.create({
  id: "signal-2",
  title: "Second signal",
  config: { url: "YOUR_URL_HERE" },
});

const addResult = useTrackStore.getState().addTrack(nextTrack);
if (!addResult.ok) showError(addResult.error);

const updateResult = useTrackStore.getState().updateBase("signal-2", {
  title: "Renamed signal",
  height: 100,
});
if (!updateResult.ok) showError(updateResult.error);

const configResult = useTrackStore.getState().updateConfig("signal-2", {
  fillWithZero: true,
});
if (!configResult.ok) showError(configResult.error);

const ids = useTrackStore.getState().order;
const reorderResult = useTrackStore.getState().reorderTracks([...ids].reverse());
if (!reorderResult.ok) showError(reorderResult.error);

const removeResult = useTrackStore.getState().removeTrack("signal-2");
if (!removeResult.ok) showError(removeResult.error);
```

A reorder array must contain every current track ID exactly once. `updateBase` preserves the existing ID; replace a track if its identity or type must change.

## Apply track changes atomically

Use `applyTrackChanges` when adds and removals must succeed together. This also permits replacing a track with another instance using the same ID:

```ts
const replacement = bigWigModule.create({
  id: "signal",
  title: "Replacement signal",
  config: { url: "YOUR_URL_HERE" },
});

const result = useTrackStore.getState().applyTrackChanges({
  remove: ["signal"],
  add: [replacement],
});

if (!result.ok) showError(result.error);
```

If any ID, module, or config is invalid, no part of the change is applied.

## Navigate and zoom

```ts
const browser = useBrowserStore.getState();

browser.setRegion("chr2:2000000-2100000");
browser.zoom(0.5); // Zoom in around the region center.
browser.zoom(2, 2_050_000); // Zoom out around a genomic base.
```

Zoom factors must be greater than zero. Region parsing and invalid zoom factors throw, so catch errors when these values come from user input.

## Add and remove highlights

```ts
useBrowserStore.getState().addHighlight({
  id: "candidate",
  region: { chromosome: "chr2", start: 2_020_000, end: 2_030_000 },
  color: "#f59e0b",
  opacity: 0.25,
});

useBrowserStore.getState().removeHighlight("candidate");
```

Omit `chromosome` to display the same coordinate range on any current chromosome. Adding an existing highlight ID is a no-op. Invalid highlight input throws.

## Keep track width responsive

`GenomeBrowser` renders at the width stored in the browser store. Observe the host element and subtract the configured margin:

```tsx
function ResponsiveBrowser() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const marginWidth = useBrowserStore.getState().marginWidth;
      useBrowserStore.getState().setTrackWidth(Math.max(1, entry.contentRect.width - marginWidth));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", overflowX: "auto" }}>
      <GenomeBrowser browserStore={useBrowserStore} trackStore={useTrackStore} />
    </div>
  );
}
```

## Share the track store with UI-v2

`@weng-lab/genomebrowser-ui-v2` is a separate optional package. Pass exactly the same track store hook to `GenomeBrowser` and `TrackSelect` so catalog validation and mutations use the browser's registry and tracks:

```tsx
import { TrackSelect } from "@weng-lab/genomebrowser-ui-v2";

<>
  <GenomeBrowser browserStore={useBrowserStore} trackStore={useTrackStore} />
  <TrackSelect
    open={trackSelectOpen}
    onClose={() => setTrackSelectOpen(false)}
    trackCatalogs={trackCatalogs}
    useTrackStore={useTrackStore}
  />
</>;
```

Register every module referenced by the catalogs in that shared store. See the UI-v2 package's own shipped docs for catalog shape and additional peer dependencies.
