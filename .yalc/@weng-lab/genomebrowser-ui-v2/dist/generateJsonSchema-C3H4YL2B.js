import { z as e } from "zod";
//#region src/TrackSelect/schema/catalogSchema.ts
var t = e.union([
	e.string(),
	e.number(),
	e.boolean(),
	e.null()
]), n = e.strictObject({
	field: e.string().min(1),
	label: e.string().min(1).optional(),
	description: e.string().min(1).optional(),
	width: e.number().positive().optional(),
	hidden: e.boolean().optional()
}), r = e.strictObject({
	id: e.string().min(1),
	label: e.string().min(1),
	description: e.string().min(1).optional(),
	columns: e.array(n).min(1),
	grouping: e.array(e.string().min(1)).default([]),
	leaf: e.string().min(1).default("title")
}), i = e.strictObject({
	$schema: e.string().min(1).optional(),
	id: e.string().min(1),
	label: e.string().min(1),
	description: e.string().min(1).optional(),
	views: e.array(r).min(1)
});
function a(n) {
	if (n.modules.length === 0) throw Error("At least one track module is required to generate a TrackSelect schema");
	let r = n.modules.map((n) => n.createInputSchema.extend({
		type: e.literal(n.type),
		metadata: e.record(e.string(), t).default({})
	}));
	return i.extend({ tracks: e.array(e.discriminatedUnion("type", r)) });
}
//#endregion
//#region src/TrackSelect/schema/generateJsonSchema.ts
function o(t) {
	return e.toJSONSchema(a(t), { io: "input" });
}
//#endregion
export { a as n, o as t };

//# sourceMappingURL=generateJsonSchema-C3H4YL2B.js.map