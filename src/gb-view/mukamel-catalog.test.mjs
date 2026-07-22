import assert from "node:assert/strict";
import test from "node:test";
import {
  createModuleRegistry,
  methylCModule,
} from "@weng-lab/genomebrowser-v2";
import { validateJson } from "@weng-lab/genomebrowser-ui-v2";
import {
  MUKAMEL_CELL_TYPES,
  MUKAMEL_TRACK_CATALOG,
} from "./mukamel-catalog.ts";

test("generates the complete ordered Mukamel source inventory", () => {
  assert.equal(MUKAMEL_CELL_TYPES.length, 29);
  assert.equal(MUKAMEL_TRACK_CATALOG.tracks.length, 261);
  assert.equal(
    new Set(MUKAMEL_TRACK_CATALOG.tracks.map(({ id }) => id)).size,
    261,
  );

  assert.deepEqual(
    MUKAMEL_TRACK_CATALOG.tracks.slice(0, 9).map(({ id }) => id),
    [
      "CGE_ADARB2_ADAM33",
      "CGE_ADARB2_ADAM33.female",
      "CGE_ADARB2_ADAM33.female.old",
      "CGE_ADARB2_ADAM33.female.young",
      "CGE_ADARB2_ADAM33.male",
      "CGE_ADARB2_ADAM33.male.old",
      "CGE_ADARB2_ADAM33.male.young",
      "CGE_ADARB2_ADAM33.old",
      "CGE_ADARB2_ADAM33.young",
    ],
  );
});

test("normalizes metadata and builds source-compatible methylC URLs", () => {
  const aggregate = MUKAMEL_TRACK_CATALOG.tracks[0];
  const femaleOld = MUKAMEL_TRACK_CATALOG.tracks[2];

  assert.deepEqual(aggregate.metadata, {
    cellType: "CGE_ADARB2_ADAM33",
    sex: "All",
    age: "All",
  });
  assert.deepEqual(femaleOld.metadata, {
    cellType: "CGE_ADARB2_ADAM33",
    sex: "Female",
    age: "Old",
  });
  assert.equal(femaleOld.type, "methylc");

  const urls = femaleOld.config.urls;
  assert.equal(
    urls.plusStrand.cpg.url,
    "https://users.wenglab.org/phanh/PsychENCODE/hg38/data/Mukamel_2024/binsize1/level3/CGE_ADARB2_ADAM33.female.old.CGN-Watson.frac.bw",
  );
  assert.equal(
    urls.minusStrand.depth.url,
    "https://users.wenglab.org/phanh/PsychENCODE/hg38/data/Mukamel_2024/binsize1/level3/CGE_ADARB2_ADAM33.female.old.CGN-Crick.cov.bw",
  );
  assert.equal(urls.plusStrand.chh.url, "");
  assert.equal(urls.minusStrand.chh.url, "");
});

test("defines both approved views and validates with methylCModule", () => {
  assert.deepEqual(
    MUKAMEL_TRACK_CATALOG.views.map(({ grouping, leaf }) => ({
      grouping,
      leaf,
    })),
    [
      { grouping: ["cellType", "sex"], leaf: "age" },
      { grouping: ["sex", "age"], leaf: "cellType" },
    ],
  );

  const registry = createModuleRegistry([methylCModule]);
  const parsedCatalog = validateJson(MUKAMEL_TRACK_CATALOG, registry);
  assert.equal(parsedCatalog.tracks.length, 261);
});
