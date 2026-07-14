# Tracks

Tracks are created by registered modules. Every module `create` input has a unique `id`, a `title`, optional `display`, `height`, and `color`, plus module-specific `config`. A module always supplies a default display and height. Color and config defaults are module-specific; required config must still be provided.

## Current built-in modules

The package currently exports these first-party modules:

- `bigWigModule`: quantitative BigWig signal
- `bigBedModule`: generic BigBed intervals
- `bulkBedModule`: multiple BigBed datasets in one row
- `transcriptModule`: transcript models from the SCREEN service
- `methylCModule`: split-strand methylation channels
- `caveModule`: CAVE data
- `manhattanModule`: regional association points from BigBed
- `ldModule`: study-based linkage disequilibrium relationships

The built-in inventory and detailed support are still evolving. The minimum create inputs below reflect the current implementation; each module's `create` signature and runtime validation remain the source of truth for optional config. BigBed-derived renderer reuse is not a recommended public workflow at this stage.

| Module             | Minimum `config`                                           | Displays          |
| ------------------ | ---------------------------------------------------------- | ----------------- |
| `bigWigModule`     | `{ url: "YOUR_URL_HERE" }`                                 | `full`, `dense`   |
| `bigBedModule`     | `{ url: "YOUR_URL_HERE" }`                                 | `dense`, `squish` |
| `bulkBedModule`    | `{ datasets: [{ name: "Sample", url: "YOUR_URL_HERE" }] }` | `full`            |
| `transcriptModule` | `{ assembly: "GRCh38", version: 47 }`                      | `squish`, `pack`  |
| `caveModule`       | `{ neurotransmitter: "GABA", age: "Adulthood" }`           | `full`            |
| `manhattanModule`  | `{ url: "YOUR_URL_HERE" }`                                 | `full`            |
| `ldModule`         | `{ studyIds: ["YOUR_STUDY_ID"] }`                          | `full`            |

`methylCModule` requires a URL entry for each methylation and depth channel. A URL may be an empty string when that channel has no data:

```ts
const methylCTrack = methylCModule.create({
  id: "methylation",
  title: "Methylation",
  config: {
    urls: {
      plusStrand: {
        cpg: { url: "YOUR_URL_HERE" },
        chg: { url: "" },
        chh: { url: "" },
        depth: { url: "YOUR_URL_HERE" },
      },
      minusStrand: {
        cpg: { url: "YOUR_URL_HERE" },
        chg: { url: "" },
        chh: { url: "" },
        depth: { url: "YOUR_URL_HERE" },
      },
    },
  },
});
```

The Transcript and LD modules post GraphQL requests to `/api/screen-graphql`. The host application owns that proxy and any SCREEN credentials. CAVE selects from package-defined datasets rather than accepting a URL. These service-specific modules may not fit every deployment.

## Registration

Register every module used by initial tracks, later mutations, or catalog UI:

```ts
import { bigWigModule, createTrackStore } from "@weng-lab/genomebrowser-v2";

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
```

The store resolves validation, requests, rendering, settings, and tooltips through `track.type`. An unregistered type is rejected. Track IDs must be unique.

Optional interaction callbacks are passed as the second argument to `module.create(...)`; their item type and actual callback support are module-specific.
