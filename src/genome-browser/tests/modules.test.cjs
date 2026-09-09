const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const packages = {};
before(async () => {
  packages["@weng-lab/genomebrowser-tracks/shared"] =
    await import("@weng-lab/genomebrowser-tracks/shared");
  packages["@weng-lab/genomebrowser"] = await import("@weng-lab/genomebrowser");
  packages["@weng-lab/genomic-reader"] =
    await import("@weng-lab/genomic-reader");
});

// Transpile local TypeScript and inject IO boundaries to exercise parsing/state.
function load(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const localRequire = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (!id.startsWith(".")) return packages[id] ?? require(id);
    const base = path.resolve(path.dirname(filename), id);
    return load(
      [base, `${base}.ts`, `${base}.tsx`].find(existsSync),
      mocks,
      cache,
    );
  };
  new Function("require", "module", "exports", source)(
    localRequire,
    module,
    module.exports,
  );
  return module.exports;
}

const row = { chromosome: "chr1", start: 10, end: 20 };

test("GRN/QTL preserve endpoint roles, linked and targetless relationships", () => {
  const { parseGrnRow } = load("../modules/grn/parse.ts");
  const { parseQtlRow } = load("../modules/qtl/parse.ts");
  const grn = parseGrnRow({ ...row, name: "chr1:30-40:TF1:GENE1" });
  assert.equal(grn.source.role, "enhancer");
  assert.equal(grn.target.role, "promoter");
  assert.equal(grn.targetTF, "TF1");
  const targetless = parseGrnRow({ ...row, name: ":GENE1:TF1:0.9" });
  assert.equal(targetless.target, undefined);
  assert.equal(targetless.targetGene, "GENE1");
  const qtl = parseQtlRow({ ...row, name: "chr1:30-40:GENE1" });
  assert.equal(qtl.source.role, "variant");
  assert.equal(qtl.target.role, "gene");
  assert.equal(parseQtlRow({ ...row, name: "chr1:40-30:GENE1" }), undefined);
  assert.equal(
    parseGrnRow({ ...row, start: -1, name: "chr1:30-40:TF1:GENE1" }),
    undefined,
  );
});

test("malformed GWAS rows are skipped with one diagnostic, valid rows survive", () => {
  const { parseGwasBigBedRow } = load("../modules/shared/gwasBigBed.ts", {});
  const { parseRows } = load("../modules/shared/rows.ts");
  const warnings = [];
  const original = console.warn;
  console.warn = (message) => warnings.push(message);
  try {
    const points = parseRows(
      [
        { ...row, name: "rs_with_underscore_4.5" },
        { ...row, name: "invalid" },
        { ...row, end: 9, name: "rs2_2" },
      ],
      parseGwasBigBedRow,
      "GWAS BigBed",
    );
    assert.equal(points.length, 1);
    assert.equal(points[0].id, "rs_with_underscore");
    assert.equal(points[0].value, 4.5);
    assert.deepEqual(warnings, [
      "GWAS BigBed: skipped 2 malformed row(s) of 3",
    ]);
  } finally {
    console.warn = original;
  }
});

function setup() {
  const { createLDSelectionStore } = load("../modules/ld/selection.tsx");
  const { attachLDInteractions } = load("../modules/ld/interactions.ts", {
    "./fetchRelationships": {},
  });
  const selectionStore = createLDSelectionStore();
  const callbacks = {};
  const requests = [];
  const controller = attachLDInteractions({
    useTrackStore: {
      getState: () => ({
        updateTrack: (id, { interaction: handlers }) => {
          callbacks[id] = handlers;
          return { ok: true };
        },
      }),
    },
    manhattanTrackId: "manhattan",
    ldTrackId: "ld",
    selectionStore,
    fetchRelationships: (id, signal) =>
      new Promise((resolve) => requests.push({ id, signal, resolve })),
  });
  return { selectionStore, callbacks, requests, controller };
}
const anchor = (id) => ({ id, chromosome: "chr1", start: 10, end: 20 });
const settle = () => new Promise((resolve) => setImmediate(resolve));

test("LD ignores stale responses, caches relationships and clears selection on reset", async () => {
  const { selectionStore, callbacks, requests, controller } = setup();
  try {
    callbacks.ld.onClick(anchor("a"));
    callbacks.ld.onClick(anchor("b"));
    assert.equal(requests[0].signal.aborted, true);
    requests[0].resolve([{ id: "stale", rSquared: 0.8 }]);
    requests[1].resolve([{ id: "c", rSquared: 0.8 }]);
    await settle();
    assert.deepEqual(selectionStore.getSnapshot().relationships, [
      { id: "c", rSquared: 0.8 },
    ]);
    assert.equal(selectionStore.getSnapshot().pinnedVariantId, "b");
    callbacks.ld.onHover(anchor("b"));
    callbacks.ld.onLeave(anchor("b"));
    assert.equal(requests.length, 2);
    controller.reset();
    assert.equal(selectionStore.getSnapshot().anchor, undefined);
    assert.equal(selectionStore.getSnapshot().pinnedVariantId, undefined);
    assert.deepEqual(selectionStore.getSnapshot().relationships, []);
  } finally {
    controller.dispose();
  }
});

test("LD hover cancellation preserves pinning and dispose prevents late updates", async () => {
  const { selectionStore, callbacks, requests, controller } = setup();
  callbacks.ld.onClick(anchor("a"));
  requests[0].resolve([{ id: "b", rSquared: 0.8 }]);
  await settle();
  callbacks.manhattan.onHover(anchor("b"));
  assert.equal(selectionStore.getSnapshot().anchor.id, "b");
  callbacks.manhattan.onLeave(anchor("b"));
  assert.equal(selectionStore.getSnapshot().anchor.id, "a");
  assert.equal(requests.length, 1);
  callbacks.ld.onClick(anchor("c"));
  controller.dispose();
  assert.equal(requests[1].signal.aborted, true);
  requests[1].resolve([{ id: "late", rSquared: 0.8 }]);
  await settle();
  callbacks.ld.onClick(anchor("after-dispose"));
  assert.equal(requests.length, 2);
  assert.deepEqual(selectionStore.getSnapshot(), {
    relationships: [],
    status: "idle",
  });
});

test("LD selection only connects visible variants and does not mutate fetched data", () => {
  const { applyLDSelection } = load("../modules/ld/normalize.ts");
  const baseline = { variants: [anchor("a"), anchor("b")], connections: [] };
  const result = applyLDSelection(baseline, {
    anchor: anchor("a"),
    relationships: ["a", "b", "outside"].map((id) => ({ id, rSquared: 0.8 })),
    status: "success",
  });
  assert.deepEqual(result.connections, [
    { sourceId: "a", targetId: "b", rSquared: 0.8 },
  ]);
  assert.equal(result.variants[0].isSelected, true);
  assert.equal(baseline.variants[0].isSelected, undefined);
  assert.deepEqual(baseline.connections, []);
});

test("beta modules create valid tracks and fetch through the resource-backed reader", async () => {
  const rows = [{ chromosome: "chr1", start: 10, end: 20, name: "rs1_4.5" }];
  const calls = [];
  const reader = {
    fetchBigBedRows: async (url, region, resources) => {
      calls.push({ url, region, resources });
      return rows;
    },
  };
  const mocks = { "./bigBed": reader, "../shared/bigBed": reader };
  const { manhattanModule } = load("../modules/manhattan/module.tsx", mocks);
  const { ldModule } = load("../modules/ld/module.tsx", mocks);
  const { singleCellGrnModule } = load("../modules/grn/module.tsx", mocks);
  const { singleCellQtlModule } = load("../modules/qtl/module.tsx", mocks);
  const modules = [
    manhattanModule,
    ldModule,
    singleCellGrnModule,
    singleCellQtlModule,
  ];
  const tracks = modules.map((module) =>
    module.create({
      id: module.type,
      title: module.type,
      config: { url: "https://downloads.wenglab.org/Ast_GRN.bb" },
    }),
  );
  const store = packages["@weng-lab/genomebrowser"].createTrackStore({
    modules,
    tracks,
  });
  assert.equal(store.getState().tracks.length, 4);
  const resources = { get: () => undefined, set() {}, delete() {}, clear() {} };
  const demand = {
    assembly: packages["@weng-lab/genomebrowser"].hg38,
    region: { chromosome: "chr1", start: 0, end: 100 },
    width: 500,
  };
  const context = (index) => ({
    track: {
      id: tracks[index].base.id,
      type: tracks[index].type,
      display: tracks[index].base.display,
      config: tracks[index].config,
    },
    demand,
    resources,
  });
  assert.equal((await manhattanModule.fetch(context(0)))[0].value, 4.5);
  assert.equal((await ldModule.fetch(context(1))).variants[0].id, "rs1");
  rows[0].name = "chr1:30-40:TF1:GENE1";
  assert.equal(
    (await singleCellGrnModule.fetch(context(2)))[0].targetTF,
    "TF1",
  );
  rows[0].name = "chr1:30-40:GENE1";
  assert.equal(
    (await singleCellQtlModule.fetch(context(3)))[0].targetGene,
    "GENE1",
  );
  assert.equal(calls.length, 4);
  assert.ok(
    calls.every(
      (call) => call.resources === resources && call.region === demand.region,
    ),
  );
});

test("BigBed resources reuse readers and replace them when the URL changes", async () => {
  const created = [];
  const { fetchBigBedRows } = load("../modules/shared/bigBed.ts", {
    "@weng-lab/genomic-reader": {
      bed3Schema: {},
      createBigBedFile: ({ url }) => {
        created.push(url);
        return {
          read: async () => [
            {
              chromosome: "chr1",
              start: 1,
              end: 2,
              fields: ["rs1_2", "extra"],
            },
          ],
        };
      },
    },
  });
  const values = new Map();
  const resources = {
    get: (key) => values.get(key),
    set: (key, value) => values.set(key, value),
  };
  const region = { chromosome: "chr1", start: 0, end: 10 };
  assert.deepEqual(await fetchBigBedRows("first", region, resources), [
    { chromosome: "chr1", start: 1, end: 2, name: "rs1_2" },
  ]);
  await fetchBigBedRows("first", region, resources);
  await fetchBigBedRows("second", region, resources);
  assert.deepEqual(created, ["first", "second"]);
});

test("Manhattan highlights the LD-selected SNP and renders a correctly scaled threshold", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const react = require("react");
  const { FullManhattan } = load("../modules/manhattan/render.tsx", {
    "../ld/selection": {
      useOptionalLDSelection: () => ({
        anchor: anchor("rs2"),
        relationships: [],
        status: "idle",
      }),
    },
    react: { ...react, useEffect() {}, useEffectEvent: (callback) => callback },
    "@weng-lab/genomebrowser": {
      useInteraction: () => undefined,
      useTooltip: () => ({ hide() {} }),
    },
  });
  const region = { chromosome: "chr1", start: 0, end: 100 };
  const html = renderToStaticMarkup(
    react.createElement(FullManhattan, {
      id: "gwas",
      config: { url: "unused", pValueThreshold: 5e-8 },
      data: [
        { ...anchor("rs1"), value: 2 },
        { ...anchor("rs2"), value: 3 },
      ],
      color: "#c43d3d",
      region,
      visibleRegion: region,
      width: 500,
      height: 100,
    }),
  );
  assert.match(html, /data-variant-id="rs2" data-active="true"/);
  assert.doesNotMatch(html, /data-variant-id="rs1" data-active="true"/);
  assert.match(html, /stroke-dasharray="2 4"/);
  assert.match(html, /P ≤ 5e-8/);
  assert.match(html, /gb-manhattan-active-label[^>]*>rs2</);
  const { pValueToScore, scoreToPValue, resolveManhattanYDomain } = load(
    "../modules/manhattan/helpers.ts",
  );
  const threshold = pValueToScore(5e-8);
  assert.ok(Math.abs(threshold - 7.30103) < 1e-6);
  assert.ok(Math.abs(scoreToPValue(2.384365531122584) - 0.004127) < 1e-10);
  const domain = resolveManhattanYDomain([{ value: 3 }], undefined, threshold);
  assert.equal(domain.min, 0);
  assert.ok(domain.max > threshold);
  assert.equal(resolveManhattanYDomain([], { max: 5 }, threshold).max, 5);
});

test("the registered Manhattan schema accepts significance-threshold edits", () => {
  const { manhattanModule } = load("../modules/manhattan/module.tsx");
  const store = packages["@weng-lab/genomebrowser"].createTrackStore({
    modules: [manhattanModule],
    tracks: [
      manhattanModule.create({
        id: "m",
        title: "GWAS",
        config: { url: "unused" },
      }),
    ],
  });
  assert.equal(
    store.getState().updateTrack("m", { config: { pValueThreshold: 0.05 } }).ok,
    true,
  );
  assert.equal(store.getState().getTrack("m").config.pValueThreshold, 0.05);
});
