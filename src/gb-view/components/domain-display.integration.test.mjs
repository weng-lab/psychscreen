import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserStore } from "@weng-lab/genomebrowser";

import DomainDisplay from "./DomainDisplay.tsx";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test("DomainDisplay wires both marker sources, navigation, and store reactivity to Cytobands", async () => {
  const dom = new JSDOM("<div id='root'></div>");
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;

  const diseaseMarkers = [
    {
      id: "disease-risk-locus:test:chr1:10-20:0",
      region: { chromosome: "chr1", start: 10, end: 20 },
      color: "#eba80c",
    },
    {
      id: "disease-risk-locus:test:chr2:30-40:1",
      region: { chromosome: "chr2", start: 30, end: 40 },
      color: "#eba80c",
    },
  ];
  const store = createBrowserStore({
    region: { chromosome: "chr1", start: 1, end: 2 },
  });
  const root = createRoot(document.getElementById("root"));

  await act(async () => {
    root.render(
      createElement(DomainDisplay, {
        useBrowserStore: store,
        cytobandMarkers: diseaseMarkers,
      }),
    );
  });

  let cytobandsProps = globalThis.__domainDisplayCytobandsProps;
  assert.deepEqual(
    cytobandsProps.highlights.map(({ id }) => id),
    diseaseMarkers.map(({ id }) => id),
  );
  assert.deepEqual(store.getState().highlights, []);

  const chromosomeLessUserHighlight = {
    id: "user-current-chromosome",
    region: { start: 50, end: 60 },
    color: "#0000ff",
  };
  const offChromosomeUserHighlight = {
    id: "user-chr2",
    region: { chromosome: "chr2", start: 70, end: 80 },
    color: "#00ff00",
  };
  await act(async () => {
    store.getState().addHighlight(chromosomeLessUserHighlight);
    store.getState().addHighlight(offChromosomeUserHighlight);
  });

  cytobandsProps = globalThis.__domainDisplayCytobandsProps;
  assert.deepEqual(
    cytobandsProps.highlights.map(({ id }) => id),
    [
      ...diseaseMarkers.map(({ id }) => id),
      chromosomeLessUserHighlight.id,
      offChromosomeUserHighlight.id,
    ],
  );
  assert.deepEqual(store.getState().highlights, [
    chromosomeLessUserHighlight,
    offChromosomeUserHighlight,
  ]);

  await act(async () => {
    cytobandsProps.onHighlightClick(diseaseMarkers[1]);
  });
  cytobandsProps = globalThis.__domainDisplayCytobandsProps;
  assert.deepEqual(store.getState().region, {
    chromosome: "chr2",
    start: 30,
    end: 40,
  });
  assert.equal(cytobandsProps.chromosome, "chr2");
  assert.deepEqual(cytobandsProps.currentRegion, store.getState().region);
  assert.equal(cytobandsProps.highlights.length, 4);

  await act(async () => {
    cytobandsProps.onHighlightClick(chromosomeLessUserHighlight);
  });
  assert.deepEqual(store.getState().region, {
    chromosome: "chr2",
    start: 50,
    end: 60,
  });

  await act(async () => {
    store.getState().removeHighlight(chromosomeLessUserHighlight.id);
  });
  cytobandsProps = globalThis.__domainDisplayCytobandsProps;
  assert.deepEqual(
    cytobandsProps.highlights.map(({ id }) => id),
    [...diseaseMarkers.map(({ id }) => id), offChromosomeUserHighlight.id],
  );
  assert.deepEqual(store.getState().highlights, [offChromosomeUserHighlight]);

  await act(async () => root.unmount());
  dom.window.close();
  delete globalThis.__domainDisplayCytobandsProps;
});
