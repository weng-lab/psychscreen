# TrackSelect

Use `TrackSelect` when users need to browse JSON-backed track catalogs and add or remove tracks from a `@weng-lab/genomebrowser-v2` track store.

`TrackSelect` is a track catalog adapter. It does not render tracks itself. It reads the registered modules and selected tracks from the provided track store hook, validates track catalogs against that registry, and stages the user's changes as a draft, applying them to the store when the user clicks Submit.

## Requirements

The package expects these peer dependencies in the host app:

```sh
pnpm add react@^19 react-dom@^19 @emotion/react@^11 @emotion/styled@^11 @mui/material@^7 @mui/icons-material@^7 @mui/x-data-grid-premium@^8 @mui/x-license@^8 @mui/x-tree-view@^8
```

The catalog grid is built on MUI X Data Grid Premium, which requires a MUI X license key. The package reads the key from `VITE_MUI_X_LICENSE_KEY` or `NEXT_PUBLIC_MUI_X_LICENSE_KEY`. Without a valid key, the grid renders with a watermark and logs console errors.

## Minimal setup

```tsx
import { useState } from "react";
import { TrackSelect } from "@weng-lab/genomebrowser-ui-v2";
import { bigWigModule, createTrackStore } from "@weng-lab/genomebrowser-v2";

const useTrackStore = createTrackStore({
  modules: [bigWigModule],
});

const trackCatalogs = [
  {
    id: "signals",
    label: "Signals",
    views: [
      {
        id: "default",
        label: "Default",
        columns: [{ field: "assay", label: "Assay" }],
        leaf: "title",
      },
    ],
    tracks: [
      {
        type: "bigwig",
        id: "signal",
        title: "Signal",
        config: {
          url: "YOUR_URL_HERE",
        },
        metadata: {
          assay: "Example assay",
        },
      },
    ],
  },
];

export function TrackSelectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Choose tracks</button>
      <TrackSelect
        open={open}
        onClose={() => setOpen(false)}
        trackCatalogs={trackCatalogs}
        useTrackStore={useTrackStore}
      />
    </>
  );
}
```

## Track catalog mental model

A track catalog contains display views followed by track entries. Views define how TrackSelect presents the catalog. Track entries define the tracks that can be added to the browser.

The catalog detail screen shows the catalog's tracks in a grid next to a panel listing the currently selected tracks.

## Track catalog JSON shape

```json
{
  "$schema": "./trackSelectCatalog.schema.json",
  "id": "signals",
  "label": "Signals",
  "description": "Signal tracks",
  "views": [
    {
      "id": "default",
      "label": "Default",
      "columns": [
        { "field": "assay", "label": "Assay" },
        { "field": "biosample", "label": "Biosample" }
      ],
      "grouping": ["assay"],
      "leaf": "title"
    }
  ],
  "tracks": [
    {
      "type": "bigwig",
      "id": "signal",
      "title": "Signal",
      "config": {
        "url": "YOUR_URL_HERE"
      },
      "metadata": {
        "assay": "Example assay",
        "biosample": "Example cell type"
      }
    }
  ]
}
```

## Views

Views define how TrackSelect presents the same tracks:

- `columns` lists fields to show. Each column needs `field` and may include `label`, `description`, `width`, and `hidden`; each view needs at least one column.
- `grouping` groups rows by fields and defaults to `[]`
- `leaf` chooses the final item label and defaults to `"title"`

Fields `id`, `title`, and `type` are built in. Other fields referenced by `columns`, `grouping`, or `leaf` must exist in every track's `metadata`.

Metadata values can be strings, numbers, booleans, or `null`.

```json
{
  "views": [
    {
      "id": "default",
      "label": "Default",
      "columns": [
        { "field": "assay", "label": "Assay" },
        { "field": "biosample", "label": "Biosample" }
      ],
      "grouping": ["assay"], // groups rows by their assay under an accordion
      "leaf": "title"
    }
  ]
}
```

## Track entries

Each track entry has:

- `type`: the registered track module type, such as `"bigwig"`
- `id`, `title`, `display`, `height`, and `color`: browser-owned create fields
- `config`: module-owned create fields accepted by that module's `create(...)` function
- `metadata`: optional values used by TrackSelect views for columns, grouping, and labels

For example:

```json
{
  "type": "bigwig",
  "id": "signal",
  "title": "Signal",
  "height": 80,
  "config": {
    "url": "YOUR_URL_HERE"
  },
  "metadata": {
    "assay": "Example assay",
    "biosample": "Example cell type"
  }
}
```

The `type` field selects the registered module. The entry is validated with that module's create-input schema before the track can be added.

## How selection is applied

Browsing and selecting only edits a draft. The track store is untouched until Submit. Submit applies all adds and removes as one store update and closes the dialog. If anything fails, such as a module's `create` function throwing or the store rejecting the update, an error alert is shown, the dialog stays open, and the store is left unchanged. Cancel or closing the dialog discards the draft. Clear empties the draft selection for the active catalog on the detail screen, or all catalogs on the list screen. Reset reverts the draft to the store's default tracks. Clear and Reset ask for confirmation first.

> TODO: IMPLEMENT RESET TO DEFAULT TRACKS

## Generating a JSON Schema

Use `generateTrackCatalogJsonSchema` when you want editor autocomplete or validation for track catalog JSON.

For the simplest workflow, create `trackselect.config.ts` in the directory where you keep your catalog JSON:

```ts
import { bigWigModule } from "@weng-lab/genomebrowser-v2";
import { defineTrackSelectConfig } from "@weng-lab/genomebrowser-ui-v2/cli";

export default defineTrackSelectConfig({
  modules: [bigWigModule],
});
```

Then run the CLI from that same directory:

```sh
trackselect schema
```

By default, the command looks for `./trackselect.config.ts` and writes `./trackSelectCatalog.schema.json`. The schema is generated from the listed modules, so catalog entries autocomplete and validate against the same module create-input shapes used by TrackSelect at runtime.

Use `schema.outFile` when you want a different package-local output path:

```ts
export default defineTrackSelectConfig({
  modules: [bigWigModule],
  schema: {
    outFile: "schemas/trackSelectCatalog.schema.json",
  },
});
```

You can also generate the schema in code:

```ts
import { generateTrackCatalogJsonSchema } from "@weng-lab/genomebrowser-ui-v2";
import { bigWigModule, createModuleRegistry } from "@weng-lab/genomebrowser-v2";

const registry = createModuleRegistry([bigWigModule]);
const schema = generateTrackCatalogJsonSchema(registry);
```

The generated schema includes the allowed `type` values and the matching create-input shape for each registered module. Config fields with Zod defaults in a module's `configSchema` are optional in the generated input schema. Register at least one module; schema generation throws if the registry is empty.

## Validating catalog JSON

Use `validateJson` if you want to validate a track catalog before rendering `TrackSelect`.

```ts
import { validateJson } from "@weng-lab/genomebrowser-ui-v2";
import { bigWigModule, createModuleRegistry } from "@weng-lab/genomebrowser-v2";

const registry = createModuleRegistry([bigWigModule]);
const catalog = validateJson(rawCatalog, registry);
```

Pass the registry from a v2 track store, or another registry created from the same modules. If a track references an unknown `type`, or its entry does not match that module's create-input schema, validation fails. `validateJson` validates catalog entries but keeps returned track rows as catalog data; module defaults are applied later when the selected entry is passed to the module's `create` function.

`TrackSelect` calls `validateJson` for each track catalog with the registry from `useTrackStore`, so the rendered dialog uses the same module set as the browser.

## Props

- `open`: whether the dialog is visible
- `onClose`: called when the dialog should close
- `trackCatalogs`: track catalogs to show
- `useTrackStore`: v2 track store hook created by `createTrackStore`
- `title`: dialog title, defaults to `"Track Select"`
- `maxTracks`: maximum selected tracks, defaults to `50`. Selections that would push the count past the limit are blocked and a track-limit dialog is shown.

## Defaults

The dialog opens directly to the catalog detail screen when there is only one track catalog. With multiple track catalogs, it opens to the catalog list.

## Sharp edges

Track catalog IDs must be unique. Track IDs must be unique within a track catalog; the same track ID can appear in another catalog because TrackSelect qualifies it with the catalog ID.

Metadata keys named `id`, `title`, or `type` are overwritten by the built-in fields, so metadata under those names is never displayed.

The modules used to generate or pre-validate catalog JSON must match the modules registered in the track store. If a JSON Schema was generated with one module set but the UI store uses another, catalog entries may validate in tooling but fail in the app.

`trackCatalogs` is parsed during render. Keep the array stable when possible so TrackSelect does not re-validate unchanged catalog data on unrelated renders.

`useTrackStore` is named with a `use` prefix because the store returned by `createTrackStore` is a Zustand hook. Keep that naming pattern for local store variables.
