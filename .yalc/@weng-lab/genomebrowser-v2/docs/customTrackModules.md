# Custom Track Modules

Create a custom module when a data type needs its own validated config, request logic, renderers, settings, or semantic interactions. Applications that only use built-in tracks do not need this API.

Module schemas use Zod directly, so module authors should install Zod as an application dependency:

```sh
pnpm add zod@^4
```

## A complete small module

The data URL affects the response, so the schema marks it with `fetchOnChange`. The visual threshold is unmarked: changing it re-renders existing data without making another request.

```tsx
import { z } from "zod";
import {
  SettingsSection,
  defineTrackModule,
  fetchOnChange,
  useInteraction,
  useTooltip,
  type TrackRendererProps,
  type TrackSettingsProps,
} from "@weng-lab/genomebrowser-v2";

const configSchema = z.object({
  url: fetchOnChange(z.string().min(1)),
  threshold: z.number().default(0),
});

type Config = z.infer<typeof configSchema>;
type Item = { start: number; end: number; value: number };
type Data = Item[];

function SignalRenderer({ config, data, region, width, height }: TrackRendererProps<Config, Data>) {
  const interaction = useInteraction<Item>();
  const tooltip = useTooltip({ type: "custom-signal", config });
  const bases = region.end - region.start;

  return data
    .filter((item) => item.value >= config.threshold)
    .map((item) => {
      const x = ((item.start - region.start) / bases) * width;
      const itemWidth = Math.max(1, ((item.end - item.start) / bases) * width);

      return (
        <rect
          key={`${item.start}-${item.end}`}
          x={x}
          width={itemWidth}
          height={height}
          onClick={() => interaction?.onClick?.(item)}
          onMouseEnter={(event) => tooltip.show(item, event)}
          onMouseLeave={tooltip.hide}
        />
      );
    });
}

function SignalSettings({ config, updateConfig }: TrackSettingsProps<Config>) {
  return (
    <SettingsSection title="Signal">
      <label>
        Threshold
        <input
          type="number"
          value={config.threshold}
          onChange={(event) => {
            const result = updateConfig({ threshold: event.currentTarget.valueAsNumber });
            if (!result.ok) console.error(result.error);
          }}
        />
      </label>
    </SettingsSection>
  );
}

export const customSignalModule = defineTrackModule<Item>()({
  type: "custom-signal",
  defaults: { height: 80, color: "#2266aa" },
  configSchema,
  async fetch({ config, region }): Promise<Data> {
    const query = new URLSearchParams({
      chromosome: region.chromosome,
      start: String(region.start),
      end: String(region.end),
    });
    const response = await fetch(`${config.url}?${query}`);
    if (!response.ok) throw new Error(`Signal request failed with ${response.status}`);
    return response.json() as Promise<Data>;
  },
  render: { full: SignalRenderer },
  settingsComponent: SignalSettings,
  tooltipComponent: ({ item }) => <text>{item.value}</text>,
});
```

The fetch function receives only parsed config and a genomic region. Return raw regional data; the renderer owns conversion to pixels and display-specific shaping. Throwing from fetch produces the browser's error state for that track.

Renderer-map keys are allowed display values. If `defaults.display` is absent, the first key is the default. Base defaults belong in `defaults`; config defaults belong in the Zod schema.

## Register and create

Register a module before any track of its type enters the store:

```ts
const useTrackStore = createTrackStore({
  modules: [customSignalModule],
  tracks: [
    customSignalModule.create(
      {
        id: "custom-signal",
        title: "Custom signal",
        config: { url: "YOUR_URL_HERE" },
      },
      {
        onClick: (item) => selectInterval(item.start, item.end),
      },
    ),
  ],
});
```

The optional second argument contains per-instance callbacks and is not serializable catalog data.

## Settings, tooltip, and interactions

Module settings receive `config` and `updateConfig`; use that focused API instead of reaching into the whole track store. Check its mutation result for user-entered values. The browser separately owns title, display, color, and height controls.

The renderer decides what semantic item a click or hover represents. `useInteraction<Item>()` reads app callbacks, while `useTooltip` opens the module's browser-positioned `tooltipComponent`. Both hooks require the renderer to run inside `GenomeBrowser`.

Use only package-root exports for module authoring.

## Reusable track primitives

The package exposes a small set of first-party building blocks for modules that share an established data or visual contract:

- `fetchBigBedRows` reads raw regional BigBed rows.
- `normalizeManhattanRows` converts names formatted as `<id>_<numeric value>` into Manhattan points.
- `createFullLDRenderer` renders normalized `LDData` and can derive an active variant or transform data from visual-only config.
- `TrackTooltip` provides the standard SVG tooltip shell.

These are narrow composition seams, not permission to import other files under `src/`. Keep source-specific requests and config in the downstream module while returning the exported normalized types.
