import assert from "node:assert/strict";
import test from "node:test";

import { getLegacyRouteTarget } from "./legacy-route.ts";

test("maps the legacy home URL to the canonical root", () => {
  assert.equal(
    getLegacyRouteTarget({ pathname: "/psychscreen", search: "", hash: "" }),
    "/",
  );
});

test("maps representative legacy routes to their unprefixed destinations", () => {
  assert.equal(
    getLegacyRouteTarget({
      pathname: "/psychscreen/downloads",
      search: "",
      hash: "",
    }),
    "/downloads",
  );
  assert.equal(
    getLegacyRouteTarget({
      pathname: "/psychscreen/single-cell/celltype/Excitatory%20neuron",
      search: "",
      hash: "",
    }),
    "/single-cell/celltype/Excitatory%20neuron",
  );
});

test("preserves path parameters, query strings, and fragments", () => {
  assert.equal(
    getLegacyRouteTarget({
      pathname: "/psychscreen/gene/ENSG00000123456",
      search: "?dataset=brain&view=summary",
      hash: "#association",
    }),
    "/gene/ENSG00000123456?dataset=brain&view=summary#association",
  );
});

test("does not treat similar unprefixed paths as legacy routes", () => {
  assert.equal(
    getLegacyRouteTarget({
      pathname: "/psychscreening/gene",
      search: "",
      hash: "",
    }),
    null,
  );
});
