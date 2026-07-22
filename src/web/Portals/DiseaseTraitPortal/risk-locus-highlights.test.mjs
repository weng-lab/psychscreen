import assert from "node:assert/strict";
import test from "node:test";
import { createBrowserStore } from "@weng-lab/genomebrowser";

import {
  combineCytobandHighlights,
  cytobandHighlightRegion,
} from "../../../gb-view/components/cytobandHighlights.ts";
import { diseaseRiskLocusHighlights, focusedRiskLocus } from "./utils.ts";

const loci = [
  { chromosome: "chr1", start: 100_000, end: 3_100_001 },
  { chromosome: "chr2", start: 2_000_000, end: 6_000_000 },
];

test("focuses broad risk loci with the established inset", () => {
  assert.deepEqual(focusedRiskLocus(loci[0]), {
    chromosome: "chr1",
    start: 1_500_000,
    end: 1_700_001,
  });
});

test("creates deterministic, unique disease risk-locus highlights", () => {
  const duplicatedLoci = [...loci, loci[0]];
  const originalLoci = structuredClone(duplicatedLoci);
  const highlights = diseaseRiskLocusHighlights(
    "example disease",
    duplicatedLoci,
  );

  assert.deepEqual(
    highlights.map(({ region }) => region),
    duplicatedLoci.map(focusedRiskLocus),
  );
  assert.equal(
    new Set(highlights.map(({ id }) => id)).size,
    duplicatedLoci.length,
  );
  assert.ok(
    highlights.every(({ id }) =>
      id.startsWith("disease-risk-locus:example%20disease:"),
    ),
  );
  assert.deepEqual(
    diseaseRiskLocusHighlights("example disease", duplicatedLoci),
    highlights,
  );
  assert.deepEqual(duplicatedLoci, originalLoci);
});

test("disease markers stay separate from browser-store highlights", () => {
  const store = createBrowserStore({
    region: { chromosome: "chr1", start: 1_500_000, end: 1_700_001 },
  });

  const markers = diseaseRiskLocusHighlights("example disease", loci);

  assert.deepEqual(store.getState().highlights, []);
  assert.equal(markers.length, loci.length);
});

test("resolves cytoband navigation for disease and chromosome-less user highlights", () => {
  const diseaseMarker = diseaseRiskLocusHighlights("example disease", loci)[1];
  const userHighlight = {
    id: "user-highlight",
    region: { start: 7_000_000, end: 7_500_000 },
    color: "#0000ff",
  };
  const store = createBrowserStore({
    region: { chromosome: "chr7", start: 1, end: 2 },
  });
  const navigateToHighlight = (highlight) => {
    const state = store.getState();
    state.setRegion(
      cytobandHighlightRegion(highlight, state.region.chromosome),
    );
  };

  navigateToHighlight(diseaseMarker);
  assert.deepEqual(store.getState().region, {
    chromosome: "chr2",
    start: diseaseMarker.region.start,
    end: diseaseMarker.region.end,
  });
  navigateToHighlight(userHighlight);
  assert.deepEqual(store.getState().region, {
    chromosome: "chr2",
    start: 7_000_000,
    end: 7_500_000,
  });
});

test("combines immutable disease markers with reactive store highlights", () => {
  const markers = diseaseRiskLocusHighlights("example disease", loci);
  const originalMarkers = structuredClone(markers);
  const store = createBrowserStore({
    region: { chromosome: "chr1", start: 1_500_000, end: 1_700_001 },
  });
  const cytobandSnapshots = [];
  const recordCytobandHighlights = (state) => {
    cytobandSnapshots.push(
      combineCytobandHighlights(markers, state.highlights).map(({ id }) => id),
    );
  };
  recordCytobandHighlights(store.getState());
  const unsubscribe = store.subscribe(recordCytobandHighlights);

  const chromosomeLessHighlight = {
    id: "user-current-chromosome",
    region: { start: 8_000_000, end: 8_500_000 },
    color: "#0000ff",
  };
  const offChromosomeHighlight = {
    id: "user-chr2",
    region: { chromosome: "chr2", start: 9_000_000, end: 9_500_000 },
    color: "#00ff00",
  };

  store.getState().addHighlight(chromosomeLessHighlight);
  store.getState().addHighlight(offChromosomeHighlight);
  assert.deepEqual(cytobandSnapshots.at(-1), [
    ...markers.map(({ id }) => id),
    chromosomeLessHighlight.id,
    offChromosomeHighlight.id,
  ]);

  store.getState().setRegion({ chromosome: "chr2", start: 1, end: 2 });
  assert.deepEqual(cytobandSnapshots.at(-1), [
    ...markers.map(({ id }) => id),
    chromosomeLessHighlight.id,
    offChromosomeHighlight.id,
  ]);
  assert.deepEqual(
    cytobandHighlightRegion(
      chromosomeLessHighlight,
      store.getState().region.chromosome,
    ),
    { chromosome: "chr2", start: 8_000_000, end: 8_500_000 },
  );

  store.getState().removeHighlight(chromosomeLessHighlight.id);
  assert.deepEqual(cytobandSnapshots.at(-1), [
    ...markers.map(({ id }) => id),
    offChromosomeHighlight.id,
  ]);
  assert.deepEqual(store.getState().highlights, [offChromosomeHighlight]);
  assert.deepEqual(markers, originalMarkers);

  unsubscribe();
});
