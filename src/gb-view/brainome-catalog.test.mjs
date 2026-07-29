import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  caveModule,
  createModuleRegistry,
} from "@weng-lab/genomebrowser";
import { validateJson } from "@weng-lab/genomebrowser-ui";
import {
  BRAINOME_AGES,
  BRAINOME_NEUROTRANSMITTERS,
  BRAINOME_TRACK_CATALOG,
} from "./brainome-catalog.ts";

test("generates every Brainome neurotransmitter and age in chronological order", () => {
  assert.equal(BRAINOME_TRACK_CATALOG.tracks.length, 12);
  assert.equal(
    new Set(BRAINOME_TRACK_CATALOG.tracks.map(({ id }) => id)).size,
    12,
  );

  assert.deepEqual(
    BRAINOME_TRACK_CATALOG.tracks.map(({ id }) => id),
    BRAINOME_NEUROTRANSMITTERS.flatMap((neurotransmitter) =>
      BRAINOME_AGES.map(({ value }) => `${neurotransmitter}.${value}`),
    ),
  );
});

test("builds valid CAVE configs with human-readable metadata and age colors", () => {
  for (const [neurotransmitterIndex, neurotransmitter] of
    BRAINOME_NEUROTRANSMITTERS.entries()) {
    for (const [ageIndex, age] of BRAINOME_AGES.entries()) {
      const track =
        BRAINOME_TRACK_CATALOG.tracks[
          neurotransmitterIndex * BRAINOME_AGES.length + ageIndex
        ];

      assert.deepEqual(track.config, {
        neurotransmitter,
        age: age.value,
      });
      assert.deepEqual(track.metadata, {
        neurotransmitter,
        developmentalAge: age.label,
      });
      assert.equal(track.type, "cave");
      assert.equal(track.id, `${neurotransmitter}.${age.value}`);
      assert.equal(track.color, age.color);
    }
  }

  const registry = createModuleRegistry([caveModule]);
  const parsedCatalog = validateJson(BRAINOME_TRACK_CATALOG, registry);
  assert.equal(parsedCatalog.tracks.length, 12);
});

test("defines both approved views and joins the shared main catalogs", async () => {
  assert.deepEqual(
    BRAINOME_TRACK_CATALOG.views.map(({ grouping, leaf }) => ({
      grouping,
      leaf,
    })),
    [
      { grouping: ["neurotransmitter"], leaf: "developmentalAge" },
      { grouping: ["developmentalAge"], leaf: "neurotransmitter" },
    ],
  );
  const catalogsSource = await readFile(
    new URL("./catalogs.ts", import.meta.url),
    "utf8",
  );
  assert.match(catalogsSource, /MAIN_TRACK_CATALOGS[^;]+BRAINOME_TRACK_CATALOG/s);
});

test("registers CAVE in the portal runtime and generated TrackSelect schema", async () => {
  const [storesSource, configSource, schemaSource] = await Promise.all([
    readFile(new URL("./stores.ts", import.meta.url), "utf8"),
    readFile(new URL("../../trackselect.config.ts", import.meta.url), "utf8"),
    readFile(new URL("./schema.json", import.meta.url), "utf8"),
  ]);

  assert.match(storesSource, /PORTAL_MODULES[^;]+caveModule/s);
  assert.match(configSource, /modules:[^;]+caveModule/s);

  const schema = JSON.parse(schemaSource);
  const serializedSchema = JSON.stringify(schema);
  assert.match(serializedSchema, /"const":"cave"/);
  assert.match(serializedSchema, /"GABA","GLU"/);
  assert.match(serializedSchema, /"Early_Childhood"/);
});
