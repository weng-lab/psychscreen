#!/usr/bin/env node
import { t as e } from "./generateJsonSchema-C3H4YL2B.js";
import { createModuleRegistry as t } from "@weng-lab/genomebrowser-v2";
import { mkdirSync as n, writeFileSync as r } from "node:fs";
import { access as i } from "node:fs/promises";
import { dirname as a, resolve as o } from "node:path";
import s from "node:process";
import { createJiti as c } from "jiti";
//#region src/trackselect.ts
var l = "trackselect.config.ts", u = "trackSelectCatalog.schema.json";
async function d() {
	let [e] = s.argv.slice(2);
	if (!e || e === "--help" || e === "-h") {
		v();
		return;
	}
	if (e !== "schema") throw Error(`Unknown command "${e}". Run trackselect --help for usage.`);
	await f(s.cwd());
}
async function f(s) {
	let c = o(s, l);
	try {
		await i(c);
	} catch {
		throw Error(`Could not find ${l} in ${s}`);
	}
	let d = await p(c);
	h(d);
	let f = e(t([...d.modules])), m = d.schema?.id ? {
		$id: d.schema.id,
		...f
	} : f, g = o(s, d.schema?.outFile ?? u);
	n(a(g), { recursive: !0 }), r(g, `${JSON.stringify(m, null, 2)}\n`), console.log(`Wrote ${g}`);
}
async function p(e) {
	return m(await c(import.meta.url).import(e));
}
function m(e) {
	return _(e) && "default" in e ? e.default : e;
}
function h(e) {
	if (!_(e)) throw Error(`${l} must export a config object`);
	if (!Array.isArray(e.modules)) throw Error(`${l} must export a modules array`);
	for (let t of e.modules) g(t);
	if (e.schema !== void 0 && !_(e.schema)) throw Error(`${l} schema must be an object when provided`);
	if (_(e.schema) && e.schema.outFile !== void 0 && typeof e.schema.outFile != "string") throw Error(`${l} schema.outFile must be a string`);
	if (_(e.schema) && e.schema.id !== void 0 && typeof e.schema.id != "string") throw Error(`${l} schema.id must be a string`);
}
function g(e) {
	if (!_(e) || typeof e.type != "string" || !("createInputSchema" in e)) throw Error(`${l} modules must contain track modules`);
}
function _(e) {
	return typeof e == "object" && !!e;
}
function v() {
	console.log("Usage: trackselect schema\n\nCommands:\n  schema    Generate TrackSelect JSON Schema from ./trackselect.config.ts");
}
d().catch((e) => {
	let t = e instanceof Error ? e.message : String(e);
	console.error(`trackselect: ${t}`), s.exitCode = 1;
});
//#endregion

//# sourceMappingURL=trackselect.js.map