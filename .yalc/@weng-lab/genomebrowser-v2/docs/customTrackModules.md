# Custom Track Modules

Use a custom track module when your data type needs its own config, fetching, rendering, settings, or tooltip behavior. A module is the browser's extension boundary: the browser orchestrates lifecycle, while the module owns track-specific behavior.

## Minimal module shape

```tsx
import { z } from "zod";
import { defineTrackModule } from "@weng-lab/genomebrowser-v2";

const configSchema = z.object({
  url: z.string().min(1),
  smoothing: z.number().default(0),
});

type Config = z.infer<typeof configSchema>;
type Data = Array<{ start: number; end: number; value: number }>;
type Item = { start: number; end: number; value: number };

export const customSignalModule = defineTrackModule<Item>()({
  type: "custom-signal",
  defaults: {
    height: 80,
    color: "#2266aa",
  },
  configSchema,
  async fetch({ config, region }): Promise<Data> {
    const response = await fetch(`${config.url}?region=${region.chromosome}:${region.start}-${region.end}`);
    return response.json();
  },
  render: {
    full: ({ data, width, height }) => (
      <g>
        {data.map((item, index) => (
          <rect key={index} x={index * 10} y={0} width={8} height={height} />
        ))}
      </g>
    ),
  },
});
```

Register the module before creating or adding tracks that use it.

```ts
const useTrackStore = createTrackStore({
  modules: [customSignalModule],
  tracks: [
    customSignalModule.create({
      id: "custom-signal",
      title: "Custom signal",
      display: "full",
      config: { url: "YOUR_URL_HERE" },
    }),
  ],
});
```

## Mental model

Put stable behavior in the module and per-track choices in the track instance. The browser owns base fields such as `id`, `title`, `display`, `height`, and `color`; the module owns fields under `config`, such as a URL; callbacks are passed as the optional second argument to `create`. Use module `defaults` for base fields, and use Zod `.default()` inside `configSchema` for config defaults.

## Sharp edges

The module `type` must be unique in the registry. Display names in `render` are the allowed `display` values for tracks using that module. Config validation runs when tracks are created, added, or updated, so schema defaults and errors become part of the user-facing behavior.
