import { createContext as e, createElement as t, memo as n, use as r, useCallback as i, useEffect as a, useId as o, useLayoutEffect as s, useMemo as c, useReducer as l, useRef as u, useState as d } from "react";
import { create as f } from "zustand";
import { z as p } from "zod";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
import { createPortal as _ } from "react-dom";
import v from "axios";
import { AxiosDataLoader as y, BigWigReader as b, FileType as x } from "genomic-reader";
//#region src/browser/data/dataStore.ts
function ee() {
	return f((e) => ({
		data: {},
		setData: (t) => e({ data: t }),
		setTrackData: (t, n) => e((e) => ({ data: {
			...e.data,
			[t]: n
		} })),
		clearTrack: (t) => e((e) => {
			let n = { ...e.data };
			return delete n[t], { data: n };
		}),
		clearAll: () => e({ data: {} })
	}));
}
//#endregion
//#region src/modules/fetchOnChange.ts
var S = p.registry();
function C(e) {
	return S.add(e, { fetchOnChange: !0 }), e;
}
function w(e, t) {
	return JSON.stringify(T(e.configSchema, t.config) ?? {});
}
function T(e, t) {
	if (S.has(e)) return t;
	if (e instanceof p.ZodObject) {
		if (!t || typeof t != "object" || Array.isArray(t)) return;
		let n = {};
		for (let [r, i] of Object.entries(e.shape)) {
			let e = T(i, Reflect.get(t, r));
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length === 0 ? void 0 : n;
	}
	if (e instanceof p.ZodArray) {
		if (!Array.isArray(t)) return;
		let n = t.map((t) => T(e.element, t));
		return n.some((e) => e !== void 0) ? n : void 0;
	}
}
//#endregion
//#region src/browser/data/fetchTrackData.ts
async function te({ registry: e, track: t, region: n }) {
	try {
		let r = e.get(t.type).fetch;
		return {
			status: "success",
			data: await r({
				config: t.config,
				region: n
			})
		};
	} catch (e) {
		return {
			status: "error",
			error: e instanceof Error ? e.message : "Unknown error"
		};
	}
}
//#endregion
//#region src/browser/data/useTrackData.ts
function ne({ useDataStore: e, registry: t, tracks: n, region: r, onSettled: i }) {
	let o = e((e) => e.data), s = e((e) => e.setData), [l, f] = d(() => /* @__PURE__ */ new Set()), p = u(null), m = u({}), h = u(i), g = E(r);
	return h.current = i, a(() => {
		let i = !0, a = new Set(n.map((e) => e.base.id)), o = re(t, n), c = ie(e.getState().data, a);
		Object.keys(e.getState().data).length !== Object.keys(c).length && s(c);
		let l = p.current === null, u = p.current !== null && p.current !== g, d = l || u ? n : n.filter((e) => {
			let t = m.current[e.base.id], n = o[e.base.id];
			return t === void 0 || t !== n;
		});
		if (d.length === 0) {
			p.current = g, m.current = o, (l || u) && h.current?.();
			return;
		}
		return f(new Set(d.map((e) => e.base.id))), Promise.all(d.map(async (e) => {
			let n = await te({
				registry: t,
				track: e,
				region: r
			});
			return [e.base.id, n];
		})).then((t) => {
			if (!i) return;
			let n = { ...ie(e.getState().data, a) };
			for (let [e, r] of t) n[e] = r;
			p.current = g, m.current = o, s(n), f(/* @__PURE__ */ new Set()), h.current?.();
		}), () => {
			i = !1;
		};
	}, [
		r,
		g,
		t,
		s,
		n,
		e
	]), {
		dataStates: c(() => ae(n, o, l), [
			o,
			l,
			n
		]),
		isFetching: l.size > 0
	};
}
function E(e) {
	return `${e.chromosome}:${e.start}-${e.end}`;
}
function re(e, t) {
	let n = {};
	for (let r of t) try {
		n[r.base.id] = w(e.get(r.type), r);
	} catch {
		n[r.base.id] = "{}";
	}
	return n;
}
function ie(e, t) {
	let n = {};
	for (let r of t) {
		let t = e[r];
		t && (n[r] = t);
	}
	return n;
}
function ae(e, t, n) {
	let r = {};
	for (let i of e) {
		let e = i.base.id, a = t[e];
		n.has(e) ? r[e] = a?.status === "success" ? a : { status: "loading" } : r[e] = a ?? { status: "loading" };
	}
	return r;
}
//#endregion
//#region src/browser/tooltip/TooltipContext.tsx
var D = e(null);
function oe({ children: e, isDisabled: t, getTooltipComponent: n, store: r }) {
	let i = c(() => ({
		isDisabled: t,
		getTooltipComponent: n,
		store: r
	}), [
		t,
		n,
		r
	]);
	return /* @__PURE__ */ h(D.Provider, {
		value: i,
		children: e
	});
}
function se() {
	let e = r(D);
	if (!e) throw Error("useTooltip must be used within a GenomeBrowser");
	return e.isDisabled;
}
function ce(e) {
	let t = r(D);
	if (!t) throw Error("useTooltip must be used within a GenomeBrowser");
	return t.getTooltipComponent(e);
}
function O(e) {
	let t = r(D);
	if (!t) throw Error("useTooltip must be used within a GenomeBrowser");
	return t.store(e);
}
//#endregion
//#region src/browser/tooltip/TooltipOverlay.tsx
var k = 10;
function le({ width: e, height: t }) {
	let n = O((e) => e.content), r = O((e) => e.isVisible), a = O((e) => e.anchor), o = u(null), [c, l] = d({
		x: 0,
		y: 0
	}), f = i(() => {
		if (!o.current) return;
		let n = o.current.getBBox(), r = a.x + k, i = a.y + k;
		r + n.width > e && (r = a.x - n.width - k), i + n.height > t && (i = a.y - n.height - k), r < 0 && (r = Math.max(0, e - n.width)), i < 0 && (i = Math.max(0, t - n.height)), l({
			x: r,
			y: i
		});
	}, [
		a.x,
		a.y,
		t,
		e
	]);
	return s(() => {
		!r || !n || f();
	}, [
		f,
		n,
		r
	]), !r || !n ? null : /* @__PURE__ */ h("g", {
		ref: o,
		transform: `translate(${c.x},${c.y})`,
		style: { pointerEvents: "none" },
		children: n
	});
}
//#endregion
//#region src/browser/tooltip/tooltipStore.ts
function ue() {
	return f((e) => ({
		isVisible: !1,
		content: void 0,
		anchor: {
			x: 0,
			y: 0
		},
		show: (t, n) => e({
			isVisible: !0,
			content: t,
			anchor: n
		}),
		hide: () => e({
			isVisible: !1,
			content: void 0,
			anchor: {
				x: 0,
				y: 0
			}
		})
	}));
}
//#endregion
//#region src/browser/tooltip/TooltipProvider.tsx
function de({ children: e, isDisabled: t, getTooltipComponent: n }) {
	return /* @__PURE__ */ h(oe, {
		store: c(() => ue(), []),
		isDisabled: i(() => t?.() === !0, [t]),
		getTooltipComponent: n,
		children: e
	});
}
//#endregion
//#region src/browser/svg/BrowserSvgContext.tsx
var fe = e(void 0);
function pe({ children: e, svg: t }) {
	return /* @__PURE__ */ h(fe.Provider, {
		value: t,
		children: e
	});
}
function A() {
	let e = r(fe);
	if (e === void 0) throw Error("useBrowserSvg must be used within a GenomeBrowser");
	return e;
}
//#endregion
//#region src/browser/state/BrowserContext.tsx
var j = e(null), me = e(null);
function he({ children: e, value: t }) {
	return /* @__PURE__ */ h(j.Provider, {
		value: t,
		children: e
	});
}
function ge({ children: e, value: t }) {
	return /* @__PURE__ */ h(me.Provider, {
		value: t,
		children: e
	});
}
function M(e) {
	let t = r(j);
	if (!t) throw Error("useTrackStore must be used within a GenomeBrowser");
	return t.trackStore(e);
}
function _e(e) {
	let t = r(j);
	if (!t) throw Error("useBrowserStore must be used within a GenomeBrowser");
	return t.browserStore(e);
}
function N(e) {
	let t = r(j);
	if (!t) throw Error("useContextMenuStore must be used within a GenomeBrowser");
	return t.contextMenuStore(e);
}
function P(e) {
	let t = r(j);
	if (!t) throw Error("useSettingsStore must be used within a GenomeBrowser");
	return t.settingsStore(e);
}
function ve() {
	let e = r(me);
	if (!e) throw Error("useTrackMutationGate must be used within a GenomeBrowser");
	return {
		isInteractionBlocked: e.isInteractionBlocked,
		runTrackMutation: (t) => e.isInteractionBlocked ? {
			ok: !1,
			error: "Track interactions are currently blocked"
		} : t()
	};
}
//#endregion
//#region src/browser/track-row/TrackHeightProvider.tsx
var ye = e(null);
function be({ children: e }) {
	let t = M((e) => e.getTrack), n = M((e) => e.updateBase), r = c(() => ({
		getTrackHeight: (e) => t(e)?.base.height,
		updateHeight: (e, t) => n(e, { height: t })
	}), [t, n]);
	return /* @__PURE__ */ h(ye.Provider, {
		value: r,
		children: e
	});
}
//#endregion
//#region src/modules/runtime/SettingsSection.tsx
function F({ title: e, children: t }) {
	return /* @__PURE__ */ g("section", {
		style: {
			display: "grid",
			gap: "8px"
		},
		children: [/* @__PURE__ */ h("div", {
			style: { fontWeight: 700 },
			children: e
		}), t]
	});
}
//#endregion
//#region src/browser/settings/settingsColor.ts
function xe(e) {
	return e ? /^#[0-9a-fA-F]{6}$/.test(e) : !1;
}
function Se(e) {
	if (!xe(e)) return "#000000";
	let t = Number.parseInt(e.slice(1, 3), 16), n = Number.parseInt(e.slice(3, 5), 16), r = Number.parseInt(e.slice(5, 7), 16);
	return t * .299 + n * .587 + r * .114 > 186 ? "#000000" : "#ffffff";
}
//#endregion
//#region src/browser/settings/DefaultBaseSettings.tsx
function Ce({ base: e, displayOptions: t, updateBase: n }) {
	let [r, i] = d(null), a = (e) => {
		let t = n(e);
		i(t.ok ? null : t.error);
	};
	return /* @__PURE__ */ g(F, {
		title: "Track",
		children: [
			r && /* @__PURE__ */ h("div", {
				style: Te,
				children: r
			}),
			/* @__PURE__ */ g("label", {
				style: we,
				children: ["Title", /* @__PURE__ */ h("input", {
					type: "text",
					value: e.title,
					onChange: (e) => a({ title: e.target.value })
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: we,
				children: ["Color", /* @__PURE__ */ g("div", {
					style: {
						display: "flex",
						gap: "6px"
					},
					children: [/* @__PURE__ */ h("input", {
						type: "color",
						value: xe(e.color) ? e.color : "#000000",
						onChange: (e) => a({ color: e.target.value })
					}), /* @__PURE__ */ h("input", {
						type: "text",
						value: e.color ?? "",
						placeholder: "#000000",
						onChange: (e) => a({ color: e.target.value || void 0 })
					})]
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: we,
				children: ["Height", /* @__PURE__ */ h("input", {
					type: "number",
					min: 20,
					value: e.height,
					onChange: (e) => {
						let t = Number(e.target.value);
						Number.isNaN(t) || a({ height: Math.max(20, t) });
					}
				})]
			}),
			t.length > 1 && /* @__PURE__ */ g("label", {
				style: we,
				children: ["Display", /* @__PURE__ */ h("select", {
					value: e.display,
					onChange: (e) => a({ display: e.target.value }),
					children: t.map((e) => /* @__PURE__ */ h("option", {
						value: e,
						children: e
					}, e))
				})]
			})
		]
	});
}
var we = {
	display: "grid",
	gap: "4px"
}, Te = {
	color: "#b00020",
	fontSize: "12px"
};
//#endregion
//#region src/browser/settings/useDraggableSettingsModal.ts
function Ee(e) {
	let [t, n] = d(e), [r, i] = d(e), a = u(null);
	(e.x !== r.x || e.y !== r.y) && (i(e), n(e));
	let o = (e) => {
		e.currentTarget.setPointerCapture(e.pointerId), a.current = {
			x: e.clientX - t.x,
			y: e.clientY - t.y
		};
	}, s = (e) => {
		a.current && n({
			x: e.clientX - a.current.x,
			y: e.clientY - a.current.y
		});
	}, c = (e) => {
		e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId), a.current = null;
	};
	return {
		position: t,
		handleProps: {
			onPointerDown: o,
			onPointerMove: s,
			onPointerUp: c,
			onPointerCancel: c,
			style: {
				cursor: "grab",
				touchAction: "none",
				userSelect: "none"
			}
		}
	};
}
//#endregion
//#region src/browser/settings/DefaultSettingsModal.tsx
function De({ track: e, title: t, position: n, closeSettings: r, children: i }) {
	let { position: o, handleProps: s } = Ee(n);
	return a(() => {
		let e = (e) => {
			e.key === "Escape" && r();
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [r]), /* @__PURE__ */ g("dialog", {
		open: !0,
		"aria-label": t,
		style: {
			...Oe,
			left: o.x,
			top: o.y
		},
		children: [/* @__PURE__ */ g("div", {
			...s,
			style: {
				...ke,
				background: e.base.color || "#f5f5f5",
				color: Se(e.base.color || "#f5f5f5"),
				...s.style
			},
			children: [/* @__PURE__ */ h("div", { children: t }), /* @__PURE__ */ h("button", {
				type: "button",
				onClick: r,
				onPointerDown: (e) => e.stopPropagation(),
				"aria-label": "Close settings",
				style: Ae,
				children: /* @__PURE__ */ g("svg", {
					"aria-hidden": "true",
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "2.5",
					children: [/* @__PURE__ */ h("path", { d: "M18 6 6 18" }), /* @__PURE__ */ h("path", { d: "m6 6 12 12" })]
				})
			})]
		}), /* @__PURE__ */ h("div", {
			style: je,
			children: i
		})]
	});
}
var Oe = {
	position: "fixed",
	zIndex: 10,
	minWidth: "280px",
	maxWidth: "420px",
	margin: 0,
	padding: 0,
	background: "#ffffff",
	border: "1px solid #cccccc",
	boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
	fontFamily: "system-ui, sans-serif",
	fontSize: "14px"
}, ke = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "12px",
	padding: "10px 12px",
	fontWeight: 700
}, Ae = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	flex: "0 0 auto",
	width: "28px",
	height: "28px",
	margin: "-4px -4px -4px 0",
	padding: 0,
	border: "none",
	borderRadius: "4px",
	background: "transparent",
	color: "inherit",
	cursor: "pointer"
}, je = {
	display: "grid",
	gap: "12px",
	padding: "12px",
	maxHeight: "min(70vh, 720px)",
	overflowY: "auto"
};
//#endregion
//#region src/browser/state/settingsStore.ts
function Me(e = {}) {
	return f((t) => ({
		open: !1,
		trackId: void 0,
		position: {
			x: 0,
			y: 0
		},
		modalComponent: e.modalComponent ?? De,
		baseSettingsComponent: e.baseSettingsComponent ?? Ce,
		openSettings: (e, n) => t({
			open: !0,
			trackId: e,
			position: n
		}),
		closeSettings: () => t({ open: !1 }),
		setModalComponent: (e) => t({ modalComponent: e }),
		setBaseSettingsComponent: (e) => t({ baseSettingsComponent: e })
	}));
}
//#endregion
//#region src/browser/state/contextMenuStore.ts
function Ne() {
	return f((e) => ({
		open: !1,
		trackId: void 0,
		position: {
			x: 0,
			y: 0
		},
		openContextMenu: (t, n) => e({
			open: !0,
			trackId: t,
			position: n
		}),
		closeContextMenu: () => e({ open: !1 })
	}));
}
//#endregion
//#region src/browser/overlays/InteractionShield.tsx
function Pe(e) {
	e.preventDefault(), e.stopPropagation();
}
function Fe({ active: e, width: t, height: n }) {
	return e ? /* @__PURE__ */ h("g", {
		role: "status",
		"aria-live": "polite",
		"aria-label": "Genome browser is updating track data",
		tabIndex: 0,
		onClick: Pe,
		onContextMenu: Pe,
		onMouseDown: Pe,
		onPointerDown: Pe,
		style: { cursor: "wait" },
		children: /* @__PURE__ */ h("rect", {
			x: 0,
			y: 0,
			width: t,
			height: n,
			fill: "rgba(255,255,255,0.3)"
		})
	}) : null;
}
//#endregion
//#region src/modules/utils/scale.ts
function I(e, t) {
	let n = e.end - e.start;
	return (r) => (r - e.start) * t / n;
}
function Ie(e, t) {
	let n = e.end - e.start;
	return (r) => Math.round(e.start + r / t * n);
}
//#endregion
//#region src/browser/overlays/highlightRects.ts
function Le({ highlights: e, region: t, width: n }) {
	let r = I(t, n);
	return e.flatMap((e) => {
		if ((e.region.chromosome ?? t.chromosome) !== t.chromosome) return [];
		let n = r(e.region.start), i = r(e.region.end);
		return [{
			id: e.id,
			x: n,
			width: i - n,
			color: e.color,
			opacity: e.opacity ?? .2
		}];
	});
}
//#endregion
//#region src/browser/overlays/Highlights.tsx
function Re({ region: e, marginWidth: t, renderWidth: n, contentX: r, browserWidth: i, totalHeight: s, registerContentGroup: c }) {
	let l = _e((e) => e.highlights), d = o(), f = u(null), p = Le({
		highlights: l,
		region: e,
		width: n
	});
	return a(() => {
		if (!(!c || !f.current)) return c(f.current);
	}, [p.length, c]), p.length === 0 ? null : /* @__PURE__ */ g("g", {
		pointerEvents: "none",
		children: [/* @__PURE__ */ h("defs", { children: /* @__PURE__ */ h("clipPath", {
			id: d,
			children: /* @__PURE__ */ h("rect", {
				x: t,
				y: 0,
				width: i - t,
				height: s
			})
		}) }), /* @__PURE__ */ h("g", {
			clipPath: `url(#${d})`,
			children: /* @__PURE__ */ h("g", {
				ref: f,
				transform: `translate(${r},0)`,
				children: p.map((e) => /* @__PURE__ */ h("rect", {
					x: e.x,
					y: 0,
					width: e.width,
					height: s,
					fill: e.color,
					fillOpacity: e.opacity
				}, e.id))
			})
		})]
	});
}
//#endregion
//#region src/browser/state/RegistryContext.tsx
var ze = e(null);
function Be({ registry: e, children: t }) {
	let n = c(() => e, [e]);
	return /* @__PURE__ */ h(ze.Provider, {
		value: n,
		children: t
	});
}
//#endregion
//#region src/browser/state/useRegistry.ts
function Ve() {
	let e = r(ze);
	if (!e) throw Error("useRegistry must be used within a RegistryProvider");
	return e;
}
//#endregion
//#region src/browser/overlays/ContextMenuController.tsx
function He() {
	let e = Ve(), t = N((e) => e.open), n = N((e) => e.trackId), r = N((e) => e.position), i = N((e) => e.closeContextMenu), o = M((e) => n ? e.getTrack(n) : void 0), s = M((e) => e.updateBase), c = M((e) => e.removeTrack), { isInteractionBlocked: l, runTrackMutation: f } = ve(), p = u(null), [m, _] = d(null);
	if (a(() => {
		if (!t) return;
		let e = (e) => {
			p.current?.contains(e.target) || i();
		}, n = (e) => {
			e.key === "Escape" && i();
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", n), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", n);
		};
	}, [i, t]), !t || !o || !n) return null;
	let v = [];
	try {
		v = Object.keys(e.get(o.type).render);
	} catch {
		v = [];
	}
	let y = (e) => {
		f(() => s(n, { display: e })).ok && i();
	}, b = () => {
		f(() => c(n)).ok && i();
	};
	return /* @__PURE__ */ g("div", {
		ref: p,
		style: {
			...We,
			left: r.x,
			top: r.y
		},
		onContextMenu: (e) => e.preventDefault(),
		children: [
			v.map((e) => /* @__PURE__ */ h(Ue, {
				label: e,
				selected: o.base.display === e,
				hovered: m === e,
				disabled: l,
				onHover: () => _(e),
				onLeave: () => _(null),
				onClick: () => y(e)
			}, e)),
			v.length > 0 && /* @__PURE__ */ h("div", { style: Ke }),
			/* @__PURE__ */ h(Ue, {
				label: "remove",
				hovered: m === "remove",
				disabled: l,
				onHover: () => _("remove"),
				onLeave: () => _(null),
				onClick: b
			})
		]
	});
}
function Ue({ label: e, selected: t = !1, hovered: n = !1, disabled: r = !1, onHover: i, onLeave: a, onClick: o }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		style: {
			...Ge,
			background: t ? "#d0d0d0" : n && !r ? "#f0f0f0" : "#ffffff",
			color: r ? "#888888" : "#000000",
			cursor: r ? "not-allowed" : "pointer"
		},
		disabled: r,
		onMouseEnter: i,
		onMouseLeave: a,
		onClick: o,
		children: e
	});
}
var We = {
	position: "fixed",
	background: "#ffffff",
	boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5)",
	zIndex: 20,
	fontSize: "12px"
}, Ge = {
	display: "block",
	width: "100%",
	padding: "5px",
	border: "none",
	background: "#ffffff",
	textAlign: "left",
	cursor: "pointer",
	fontSize: "12px"
}, Ke = {
	height: "1px",
	background: "#cccccc"
};
//#endregion
//#region src/browser/overlays/SettingsModalController.tsx
function qe() {
	let e = Ve(), t = P((e) => e.open), n = P((e) => e.trackId), r = P((e) => e.position), i = P((e) => e.modalComponent), a = P((e) => e.baseSettingsComponent), o = P((e) => e.closeSettings), s = M((e) => n ? e.getTrack(n) : void 0), c = M((e) => e.updateBase), l = M((e) => e.updateConfig), { isInteractionBlocked: u, runTrackMutation: d } = ve();
	if (!t || !s) return null;
	try {
		let t = e.get(s.type), n = t.settingsComponent;
		return /* @__PURE__ */ h(i, {
			track: s,
			title: `Configure ${s.base.title}`,
			position: r,
			closeSettings: o,
			children: /* @__PURE__ */ g("div", {
				"aria-disabled": u,
				style: { pointerEvents: u ? "none" : void 0 },
				children: [/* @__PURE__ */ h(a, {
					base: s.base,
					displayOptions: Object.keys(t.render),
					updateBase: (e) => d(() => c(s.base.id, e))
				}), n && /* @__PURE__ */ h(n, {
					id: s.base.id,
					config: s.config,
					updateConfig: (e) => d(() => l(s.base.id, e))
				})]
			})
		});
	} catch (e) {
		return /* @__PURE__ */ h(i, {
			track: s,
			title: `Configure ${s.base.title}`,
			position: r,
			closeSettings: o,
			children: /* @__PURE__ */ h("div", { children: e instanceof Error ? e.message : "No settings available" })
		});
	}
}
//#endregion
//#region src/browser/svg/SvgShell.tsx
function Je({ width: e, height: t, setSvg: n, children: r }) {
	let i = u(null);
	return a(() => (n(i.current), () => n(null)), [n]), /* @__PURE__ */ h("svg", {
		id: "browserSVG",
		ref: i,
		viewBox: `0 0 ${e} ${t}`,
		width: "100%",
		height: "auto",
		style: {
			border: "1px solid #ccc",
			background: "#ffffff"
		},
		children: r
	});
}
//#endregion
//#region src/browser/track-row/trackLayout.ts
function L(e, t) {
	return e.base.height + (e.base.title ? t + 5 : 0);
}
function Ye(e, t) {
	return e.base.title ? t + 5 : 0;
}
function Xe(e, t) {
	return e.reduce((e, n) => e + L(n, t), 0);
}
//#endregion
//#region src/modules/utils/svg.ts
function R(e, t, n) {
	let r = e.createSVGPoint();
	r.x = t, r.y = n;
	let i = e.getScreenCTM();
	if (!i) return null;
	let a = r.matrixTransform(i.inverse());
	return {
		x: a.x,
		y: a.y
	};
}
//#endregion
//#region src/browser/track-row/trackSwapMath.ts
function Ze(e, t) {
	return e?.draggedId === t.draggedId && e.currentIndex === t.currentIndex && e.targetIndex === t.targetIndex;
}
function Qe(e, t, n, r) {
	let i = t.findIndex((t) => t.base.id === e);
	if (i < 0) return null;
	let a = t.map((e) => L(e, n)), o = a.map((e, t) => t < i ? -a.slice(t, i).reduce((e, t) => e + t, 0) : t > i ? a.slice(i + 1, t + 1).reduce((e, t) => e + t, 0) : 0);
	return {
		draggedId: e,
		currentIndex: i,
		targetIndex: o.reduce((e, t, n) => Math.abs(t - r) < Math.abs(o[e] - r) ? n : e, 0)
	};
}
function $e(e, t, n, r, i) {
	if (!i || t === i.draggedId) return 0;
	let a = n[i.currentIndex];
	if (!a) return 0;
	let o = L(a, r);
	return i.targetIndex > i.currentIndex ? e > i.currentIndex && e <= i.targetIndex ? -o : 0 : i.targetIndex < i.currentIndex && e >= i.targetIndex && e < i.currentIndex ? o : 0;
}
function et(e, t, n, r) {
	let i = Qe(e, t, n, r);
	if (!i) return null;
	let { currentIndex: a, targetIndex: o } = i;
	if (o === a) return null;
	let s = t.map((e) => e.base.id), [c] = s.splice(a, 1);
	return s.splice(o, 0, c), s;
}
//#endregion
//#region src/browser/track-row/useTrackSwap.ts
function tt({ track: e, titleSize: t, disabled: n = !1, onPreviewChange: r, onPreviewEnd: i, cloneRef: o }) {
	let s = A(), c = M((e) => e.tracks), l = M((e) => e.reorderTracks), { isInteractionBlocked: f, runTrackMutation: p } = ve(), [m, h] = d(null), g = m !== null, _ = u(null);
	a(() => {
		if (m) return document.addEventListener("mousemove", m.handleMove), document.addEventListener("mouseup", m.handleUp), () => {
			document.removeEventListener("mousemove", m.handleMove), document.removeEventListener("mouseup", m.handleUp), m.didEnd() || i();
		};
	}, [m, i]);
	let v = n || f ? void 0 : (a) => {
		if (n || f || a.button !== 0 || !s || c.length < 2) return;
		let u = R(s, a.clientX, a.clientY);
		if (!u) return;
		a.preventDefault(), a.stopPropagation();
		let d = u.y, m = 0, g = !1, v = (n) => {
			let i = Qe(e.base.id, c, t, n);
			!i || Ze(_.current, i) || (_.current = i, r(i));
		}, y = (e) => {
			o.current?.setAttribute("transform", `translate(0,${e})`);
		};
		_.current = null, h({
			didEnd: () => g,
			handleMove: (e) => {
				e.preventDefault();
				let t = R(s, e.clientX, e.clientY);
				t && (m = t.y - d, y(m), v(m));
			},
			handleUp: (n) => {
				if (n.preventDefault(), Math.abs(m) > 5) {
					let n = et(e.base.id, c, t, m);
					n && p(() => l(n));
				}
				g = !0, h(null), _.current = null, i();
			}
		}), v(0);
	};
	return {
		svg: s,
		isSwapping: g,
		swapProps: {
			onSwapMouseDown: v,
			swapping: g,
			isDragClone: !1
		},
		cloneSwapProps: {
			onSwapMouseDown: v,
			swapping: !0,
			isDragClone: !0
		}
	};
}
//#endregion
//#region src/browser/track-row/SwapTrack.tsx
function nt({ track: e, titleSize: t, disabled: n = !1, onPreviewChange: r, onPreviewEnd: i, children: a }) {
	let o = u(null), { svg: s, isSwapping: c, swapProps: l, cloneSwapProps: d } = tt({
		track: e,
		titleSize: t,
		disabled: n,
		onPreviewChange: r,
		onPreviewEnd: i,
		cloneRef: o
	});
	return /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("g", {
		opacity: +!c,
		pointerEvents: c ? "none" : void 0,
		children: a(l)
	}), c && s && _(/* @__PURE__ */ h("g", {
		ref: o,
		transform: "translate(0,0)",
		style: {
			cursor: "grabbing",
			filter: "drop-shadow(2px 2px 2px gray)",
			pointerEvents: "none"
		},
		children: a(d)
	}), s)] });
}
//#endregion
//#region src/modules/interaction.ts
var rt = e(null);
function it({ interaction: e, children: n }) {
	return t(rt.Provider, { value: e ?? null }, n);
}
function z() {
	return r(rt);
}
//#endregion
//#region src/browser/track-row/icons.tsx
function at(e) {
	return /* @__PURE__ */ h("svg", {
		...e,
		viewBox: "0 0 24 24",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ h("path", {
			stroke: e.fill || "#000000",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeWidth: "2",
			d: "M20 20H4m8-3V6m0 11l3-3m-3 3l-3-3"
		})
	});
}
function ot(e) {
	return /* @__PURE__ */ h("svg", {
		...e,
		viewBox: "0 0 24 24",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ h("path", {
			stroke: e.fill || "#000000",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeWidth: "2",
			d: "M20 4H4m8 3v11m0-11l3 3m-3-3l-3 3"
		})
	});
}
function st(e) {
	return /* @__PURE__ */ h("svg", {
		...e,
		viewBox: "0 0 24 24",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ h("path", {
			fill: e.fill || "#000000",
			d: "M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.37-.31-.6-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98l-.38-2.65A.49.49 0 0 0 14.01 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.24-1.18.56-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65a7.93 7.93 0 0 0 0 1.96l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.12.22.37.31.6.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.24 1.18-.56 1.69-.98l2.49 1c.23.08.48 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
		})
	});
}
function ct({ width: e, height: t, outline: n, inside: r }) {
	return /* @__PURE__ */ g("svg", {
		width: e,
		height: t,
		viewBox: "0 0 451.74 481.74",
		children: [
			/* @__PURE__ */ h("path", {
				fill: n,
				d: "M446.324,367.381L262.857,41.692c-15.644-28.444-58.311-28.444-73.956,0L5.435,367.381c-15.644,28.444,4.267,64,36.978,64h365.511C442.057,429.959,461.968,395.825,446.324,367.381z"
			}),
			/* @__PURE__ */ h("path", {
				fill: r,
				d: "M225.879,63.025l183.467,325.689H42.413L225.879,63.025L225.879,63.025z"
			}),
			/* @__PURE__ */ h("path", {
				fill: "#3F4448",
				d: "M196.013,212.359l11.378,75.378c1.422,8.533,8.533,15.644,18.489,15.644l0,0c8.533,0,17.067-7.111,18.489-15.644l11.378-75.378c2.844-18.489-11.378-34.133-29.867-34.133l0,0C207.39,178.225,194.59,193.87,196.013,212.359z"
			}),
			/* @__PURE__ */ h("circle", {
				fill: "#3F4448",
				cx: "225.879",
				cy: "336.092",
				r: "17.067"
			})
		]
	});
}
function lt({ width: e, height: t, color: n }) {
	return /* @__PURE__ */ g("svg", {
		width: e,
		height: t,
		viewBox: "0 0 40 40",
		children: [/* @__PURE__ */ h("path", {
			opacity: "0.2",
			fill: n,
			d: "M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
		}), /* @__PURE__ */ h("path", {
			fill: n,
			d: "M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z",
			children: /* @__PURE__ */ h("animateTransform", {
				attributeType: "xml",
				attributeName: "transform",
				type: "rotate",
				from: "0 20 20",
				to: "360 20 20",
				dur: "0.5s",
				repeatCount: "indefinite"
			})
		})]
	});
}
//#endregion
//#region src/browser/track-row/ErrorState.tsx
function ut({ x: e, y: t, width: n, height: r, message: i }) {
	let a = Math.max(18, Math.min(r / 3, 40));
	return /* @__PURE__ */ g("g", {
		transform: `translate(${e + (n - a) / 2},${t + (r - a) / 2})`,
		children: [/* @__PURE__ */ h(ct, {
			outline: "#000000",
			inside: "#ffffff",
			width: a,
			height: a
		}), /* @__PURE__ */ h("text", {
			fill: "#000000",
			textAnchor: "middle",
			fontSize: "12px",
			x: a / 2,
			y: a + 14,
			children: i
		})]
	});
}
//#endregion
//#region src/browser/track-row/LoadingState.tsx
function dt({ x: e, y: t, width: n, height: r }) {
	let i = Math.max(18, Math.min(r / 3, 40));
	return /* @__PURE__ */ h("g", {
		transform: `translate(${e + (n - i) / 2},${t + (r - i) / 2})`,
		children: /* @__PURE__ */ h(lt, {
			width: i,
			height: i,
			color: "#000000"
		})
	});
}
//#endregion
//#region src/browser/track-row/TrackContent.tsx
var ft = n(function({ track: e, dataState: t, region: n, width: r, height: i, titleMargin: a }) {
	let o = Ve();
	if (t.status === "loading") return /* @__PURE__ */ h(dt, {
		x: 0,
		y: 0,
		width: r,
		height: i
	});
	if (t.status === "error") return /* @__PURE__ */ h(ut, {
		x: 0,
		y: 0,
		width: r,
		height: i + a,
		message: t.error
	});
	try {
		let a = o.get(e.type).render[e.base.display];
		return a ? /* @__PURE__ */ h(it, {
			interaction: e.interaction,
			children: /* @__PURE__ */ h(a, {
				id: e.base.id,
				config: e.config,
				color: e.base.color,
				data: t.data,
				region: n,
				width: r,
				height: i
			})
		}) : /* @__PURE__ */ h(ut, {
			x: 0,
			y: 0,
			width: r,
			height: i,
			message: `Display "${e.base.display}" is not supported by "${e.type}"`
		});
	} catch (e) {
		return /* @__PURE__ */ h(ut, {
			x: 0,
			y: 0,
			width: r,
			height: i,
			message: e instanceof Error ? e.message : "Unknown error"
		});
	}
});
//#endregion
//#region src/browser/track-row/PanTrack.tsx
function pt({ panDrag: e, disabled: t, width: n, height: r, children: i }) {
	let [a, o] = d(!1);
	return e ? /* @__PURE__ */ g("g", {
		style: { cursor: t ? "default" : a ? "grabbing" : "grab" },
		onPointerDown: (t) => {
			let n = e.onPointerDown(t);
			return n && o(!0), n;
		},
		onPointerMove: e.onPointerMove,
		onPointerUp: (t) => {
			e.onPointerUp(t), o(!1);
		},
		onPointerCancel: (t) => {
			e.onPointerCancel(t), o(!1);
		},
		onClickCapture: e.onClickCapture,
		children: [/* @__PURE__ */ h("rect", {
			width: n,
			height: r,
			fill: "transparent",
			pointerEvents: "all"
		}), i]
	}) : i;
}
//#endregion
//#region src/browser/track-row/TrackControls.tsx
function mt({ track: e, marginWidth: t, wrapperHeight: n }) {
	let r = u(null), i = P((e) => e.openSettings), a = M((e) => e.order), o = M((e) => e.reorderTracks), { isInteractionBlocked: s, runTrackMutation: c } = ve(), l = e.base.id, d = a.indexOf(l), f = !s && d > 0, p = !s && d >= 0 && d < a.length - 1, m = (e) => {
		let t = a.filter((e) => e !== l);
		e === "top" && t.unshift(l), e === "bottom" && t.push(l), c(() => o(t));
	};
	return /* @__PURE__ */ g("g", { children: [
		/* @__PURE__ */ g("g", {
			ref: r,
			onClick: (e) => {
				e.stopPropagation();
				let t = r.current?.getBoundingClientRect();
				i(l, t ? {
					x: t.left,
					y: t.top
				} : {
					x: 0,
					y: 0
				});
			},
			onMouseDown: (e) => e.stopPropagation(),
			style: { cursor: "pointer" },
			children: [/* @__PURE__ */ h("circle", {
				cx: t / 10 + 7.5,
				cy: n / 2 + 10,
				r: 7.5,
				strokeWidth: 0,
				fill: "transparent"
			}), /* @__PURE__ */ h(st, {
				x: t / 10,
				y: n / 2 + 3,
				height: 15,
				width: 15,
				fill: "#000000"
			})]
		}),
		/* @__PURE__ */ g("g", {
			onClick: f ? () => m("top") : void 0,
			onMouseDown: (e) => e.stopPropagation(),
			style: { cursor: f ? "pointer" : "default" },
			children: [/* @__PURE__ */ h("circle", {
				cx: t / 10 + 22.5,
				cy: n / 2 + 10,
				r: 7.5,
				strokeWidth: 0,
				fill: "transparent"
			}), /* @__PURE__ */ h(ot, {
				x: t / 10 + 15,
				y: n / 2 + 3,
				height: 15,
				width: 15,
				fill: f ? "#000000" : "#cccccc"
			})]
		}),
		/* @__PURE__ */ g("g", {
			onClick: p ? () => m("bottom") : void 0,
			onMouseDown: (e) => e.stopPropagation(),
			style: { cursor: p ? "pointer" : "default" },
			children: [/* @__PURE__ */ h("circle", {
				cx: t / 10 + 37.5,
				cy: n / 2 + 10,
				r: 7.5,
				strokeWidth: 0,
				fill: "transparent"
			}), /* @__PURE__ */ h(at, {
				x: t / 10 + 30,
				y: n / 2 + 2,
				height: 15,
				width: 15,
				fill: p ? "#000000" : "#cccccc"
			})]
		})
	] });
}
//#endregion
//#region src/browser/track-row/TrackFrame.tsx
function ht({ track: e, y: t, previewOffsetY: n = 0, marginWidth: r, trackWidth: i, contentX: s = r, contentWidth: c = i, registerContentGroup: l, panDrag: f, isPanLocked: p = !1, onSwapMouseDown: m, swapping: _ = !1, isDragClone: v = !1, disableHover: y = !1, titleSize: b, children: x }) {
	let [ee, S] = d(!1), C = u(null), w = L(e, b), T = Ye(e, b), te = o(), ne = N((e) => e.openContextMenu), E = ee && !y;
	a(() => {
		if (!(v || !l || !C.current)) return l(C.current);
	}, [v, l]);
	let re = (t) => {
		t.preventDefault(), ne(e.base.id, {
			x: t.pageX,
			y: t.pageY
		});
	};
	return /* @__PURE__ */ g("g", {
		transform: `translate(0,${t + n})`,
		onMouseMove: () => {
			y || S(!0);
		},
		onMouseLeave: () => S(!1),
		children: [
			/* @__PURE__ */ h("defs", { children: /* @__PURE__ */ h("clipPath", {
				id: te,
				children: /* @__PURE__ */ h("rect", {
					x: r,
					y: T,
					width: i,
					height: e.base.height
				})
			}) }),
			/* @__PURE__ */ h("rect", {
				x: r,
				y: 0,
				width: i,
				height: w,
				fill: "#ffffff",
				onContextMenu: re
			}),
			/* @__PURE__ */ h("g", {
				clipPath: `url(#${te})`,
				onContextMenu: re,
				children: /* @__PURE__ */ h("g", {
					ref: C,
					transform: `translate(${s},0)`,
					children: /* @__PURE__ */ h("g", {
						transform: `translate(0,${T})`,
						children: /* @__PURE__ */ h(pt, {
							panDrag: f,
							disabled: p,
							width: c,
							height: e.base.height,
							children: x
						})
					})
				})
			}),
			/* @__PURE__ */ h("text", {
				fill: "#000000",
				x: r + i / 2,
				y: b / 2 + 5,
				fontSize: `${b}px`,
				textAnchor: "middle",
				alignmentBaseline: "baseline",
				children: e.base.title
			}),
			/* @__PURE__ */ h("rect", {
				x: 0,
				y: 0,
				width: r,
				height: w,
				fill: "#ffffff",
				onMouseDown: m,
				style: { cursor: m ? _ ? "grabbing" : "grab" : "default" }
			}),
			/* @__PURE__ */ h("rect", {
				x: 0,
				y: 0,
				width: r / 15,
				height: w,
				stroke: "#000000",
				strokeWidth: .5,
				fill: e.base.color || "#ffffff"
			}),
			/* @__PURE__ */ h(mt, {
				track: e,
				marginWidth: r,
				wrapperHeight: w
			}),
			/* @__PURE__ */ h("line", {
				stroke: "#cccccc",
				x1: r,
				x2: r,
				y1: 0,
				y2: w
			}),
			E && /* @__PURE__ */ h("rect", {
				width: r + i,
				height: w,
				fill: e.base.color || "transparent",
				fillOpacity: .25,
				style: { pointerEvents: "none" }
			})
		]
	});
}
//#endregion
//#region src/browser/track-row/TrackStack.tsx
function gt({ tracks: e, dataStates: t, region: n, marginWidth: r, trackWidth: a, contentX: o, contentWidth: s, registerContentGroup: c, panDrag: l, isPanLocked: u, titleSize: f, startY: p }) {
	let [m, g] = d(null), _ = i((e) => {
		g((t) => Ze(t, e) ? t : e);
	}, []), v = i(() => {
		g(null);
	}, []), y = p;
	return e.map((i, d) => {
		let p = y, g = L(i, f), b = Ye(i, f), x = $e(d, i.base.id, e, f, m);
		return y += g, /* @__PURE__ */ h(nt, {
			track: i,
			titleSize: f,
			disabled: u,
			onPreviewChange: _,
			onPreviewEnd: v,
			children: (e) => /* @__PURE__ */ h(ht, {
				...e,
				track: i,
				y: p,
				previewOffsetY: x,
				marginWidth: r,
				trackWidth: a,
				contentX: o,
				contentWidth: s,
				registerContentGroup: c,
				panDrag: l,
				isPanLocked: u,
				disableHover: !!m,
				titleSize: f,
				children: /* @__PURE__ */ h(ft, {
					track: i,
					dataState: t[i.base.id],
					region: n,
					width: s ?? a,
					height: i.base.height,
					titleMargin: b
				})
			})
		}, i.base.id);
	});
}
//#endregion
//#region src/modules/schemas.ts
function _t(e) {
	return e.issues.map((e) => `${e.path.join(".") || "input"}: ${e.message}`).join("; ");
}
function B(e, t, n) {
	let r = e.safeParse(t);
	if (!r.success) throw Error(`${n} is invalid: ${_t(r.error)}`);
	return r.data;
}
//#endregion
//#region src/modules/utils/region.ts
var vt = p.object({
	chromosome: p.string().min(1),
	start: p.number().int(),
	end: p.number().int()
}).refine((e) => e.start < e.end, {
	message: "start must be less than end",
	path: ["start"]
});
function yt(e) {
	if (typeof e != "string") return B(vt, e, "Region");
	let t = e.replace(/,/g, ""), n = /^(?<chromosome>[^:]+):(?<start>\d+)-(?<end>\d+)$/.exec(t);
	if (!n?.groups) throw Error(`Invalid region: ${e}`);
	return B(vt, {
		chromosome: n.groups.chromosome,
		start: Number(n.groups.start),
		end: Number(n.groups.end)
	}, "Region");
}
function bt(e) {
	return e >= 1e9 ? `${Math.round(e / 1e9)} Gb` : e >= 1e6 ? `${Math.round(e / 1e6)} Mb` : e >= 1e3 ? `${Math.round(e / 1e3)} kb` : `${e} bp`;
}
function xt({ region: e, width: t }) {
	let n = c(() => {
		let n = e.end - e.start, r = 10 ** Math.floor(Math.log10(Math.ceil(n / 20))) * 6, i = I(e, t), a = (Math.ceil(e.end / r) - Math.ceil(e.start / r)) * r / 2, o = {
			start: e.start + a / 2,
			end: e.end - a / 2
		}, s = [];
		for (let t = Math.ceil(e.start / r); t < Math.ceil(e.end / r); t += 1) {
			let e = t * r;
			s.push(/* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("line", {
				x1: i(e),
				x2: i(e),
				y1: 80 * .6,
				y2: 80 * .9,
				stroke: "#000000",
				strokeWidth: .5
			}), /* @__PURE__ */ h("text", {
				fill: "#000000",
				textAnchor: "end",
				fontSize: `${80 / 6}px`,
				x: i(e) - 5,
				y: 80 * .85,
				style: {
					userSelect: "none",
					pointerEvents: "none"
				},
				children: e.toLocaleString()
			})] }, e));
		}
		return {
			x: i,
			scaleDomain: o,
			ticks: s
		};
	}, [e, t]);
	return /* @__PURE__ */ g("g", {
		width: t,
		height: 80,
		children: [
			/* @__PURE__ */ h("line", {
				x1: n.x(n.scaleDomain.start),
				x2: n.x(n.scaleDomain.start),
				y1: 80 * .1,
				y2: 80 * .4,
				stroke: "#000000",
				strokeWidth: .5
			}),
			/* @__PURE__ */ h("line", {
				x1: n.x(n.scaleDomain.end),
				x2: n.x(n.scaleDomain.end),
				y1: 80 * .1,
				y2: 80 * .4,
				stroke: "#000000",
				strokeWidth: .5
			}),
			/* @__PURE__ */ h("line", {
				x1: n.x(n.scaleDomain.start),
				x2: n.x(n.scaleDomain.end),
				y1: 80 * .25,
				y2: 80 * .25,
				stroke: "#000000",
				strokeWidth: .5
			}),
			/* @__PURE__ */ h("text", {
				x: n.x(n.scaleDomain.start) - 5,
				y: 80 * .35,
				fontSize: `${80 / 6}px`,
				textAnchor: "end",
				fill: "#000000",
				style: {
					userSelect: "none",
					pointerEvents: "none"
				},
				children: bt(n.scaleDomain.end - n.scaleDomain.start)
			}),
			n.ticks
		]
	});
}
//#endregion
//#region src/browser/viewport/SelectRegion.tsx
function St({ svg: e, marginWidth: t, trackWidth: n, totalHeight: r, region: o, setRegion: s, disabled: c = !1, children: d }) {
	let [f, p] = l(Ct, null), _ = u(!1), v = u(f), y = u(null);
	v.current = f;
	let b = i(() => {
		y.current?.();
	}, []);
	a(() => b, [b]);
	let x = () => {
		if (!e) return;
		b();
		let r = (r) => {
			if (!_.current) return;
			let i = R(e, r.clientX, r.clientY);
			i && p({
				type: "move",
				x: Math.max(t, Math.min(t + n, i.x))
			});
		}, i = () => {
			if (!_.current) return;
			b(), _.current = !1, p({ type: "clear" });
			let e = v.current;
			if (!e) return;
			let r = Math.min(e.start, e.end), i = Math.max(e.start, e.end);
			if (i - r >= 10) {
				let e = Ie(o, n);
				s({
					chromosome: o.chromosome,
					start: e(r - t),
					end: e(i - t)
				});
			}
		};
		document.addEventListener("mousemove", r), document.addEventListener("mouseup", i), y.current = () => {
			document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", i), y.current = null;
		};
	};
	return /* @__PURE__ */ g(m, { children: [
		/* @__PURE__ */ h("rect", {
			fill: "#ffffff",
			width: n,
			height: 80,
			x: t,
			y: 0,
			onMouseDown: (r) => {
				if (c || !e) return;
				let i = R(e, r.clientX, r.clientY);
				i && (p({
					type: "start",
					x: Math.max(t, Math.min(t + n, i.x))
				}), _.current = !0, x());
			}
		}),
		d,
		f && /* @__PURE__ */ h("rect", {
			id: "selectRegion",
			fill: "#6666aaaa",
			stroke: "#000000",
			strokeWidth: .5,
			strokeDasharray: "5 5",
			x: Math.min(f.start, f.end),
			y: 0,
			width: Math.abs(f.end - f.start),
			height: r,
			style: { pointerEvents: "none" }
		})
	] });
}
function Ct(e, t) {
	switch (t.type) {
		case "start": return {
			start: t.x,
			end: t.x
		};
		case "move": return e && {
			...e,
			end: t.x
		};
		case "clear": return null;
	}
}
//#endregion
//#region src/browser/viewport/useContentTransform.ts
function wt(e) {
	let t = u(0), n = u(null);
	n.current ||= /* @__PURE__ */ new Set();
	let r = i(() => t.current, []), o = i((r) => {
		t.current = r;
		for (let t of n.current) t.setAttribute("transform", `translate(${e + r},0)`);
	}, [e]), s = i((r) => (n.current.add(r), r.setAttribute("transform", `translate(${e + t.current},0)`), () => {
		n.current.delete(r);
	}), [e]);
	return a(() => {
		o(t.current);
	}, [o]), {
		getContentOffset: r,
		setContentOffset: o,
		registerContentGroup: s
	};
}
//#endregion
//#region src/browser/viewport/usePanDrag.ts
var Tt = 10;
function Et({ disabled: e, svg: t, getCurrentDelta: n, setDelta: r, onStart: a, onCommit: o, onCancel: s }) {
	let c = u(!1), l = u(null), d = u(null), f = u(0), p = u(0), m = u(!1), h = i((e) => t ? R(t, e.clientX, e.clientY)?.x ?? null : null, [t]), g = i((e) => {
		e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId), d.current === e.pointerId && (d.current = null);
	}, []), _ = i(() => {
		l.current = null, d.current = null, c.current = !1;
	}, []), v = i((e) => {
		d.current !== e.pointerId && (e.currentTarget.setPointerCapture(e.pointerId), d.current = e.pointerId);
	}, []), y = i((t) => {
		if (e || !t.isPrimary || t.button !== 0) return !1;
		let r = h(t);
		return r === null ? !1 : (l.current = t.pointerId, f.current = r, p.current = n(), c.current = !0, a(), !0);
	}, [
		e,
		n,
		h,
		a
	]);
	return {
		isDragging: i(() => c.current, []),
		onPointerDown: y,
		onPointerMove: i((e) => {
			if (l.current !== e.pointerId) return;
			let t = h(e);
			if (t === null) return;
			let n = p.current + t - f.current;
			Math.abs(n) >= Tt && (e.preventDefault(), v(e)), r(n);
		}, [
			v,
			h,
			r
		]),
		onPointerUp: i((e) => {
			if (l.current !== e.pointerId) return;
			g(e), _();
			let t = n();
			if (Math.abs(t) < Tt) {
				m.current = !1, s();
				return;
			}
			e.preventDefault(), m.current = !0, o(t);
		}, [
			n,
			s,
			o,
			g,
			_
		]),
		onPointerCancel: i((e) => {
			l.current === e.pointerId && (g(e), _(), s());
		}, [
			s,
			g,
			_
		]),
		onClickCapture: i((e) => {
			m.current && (m.current = !1, e.preventDefault(), e.stopPropagation());
		}, [])
	};
}
//#endregion
//#region src/browser/viewport/usePanController.ts
function Dt(e, t) {
	let n = e.end - e.start, r = Math.floor(n * (t - 1) / 2);
	return {
		chromosome: e.chromosome,
		start: e.start - r,
		end: e.end + r
	};
}
function Ot(e, t, n) {
	let r = e.end - e.start, i = Math.floor(n / t * r);
	return {
		chromosome: e.chromosome,
		start: e.start - i,
		end: e.end - i
	};
}
function kt({ svg: e, region: t, trackWidth: n, getContentOffset: r, setContentOffset: a, setRegion: o, onPanStart: s }) {
	let [c, l] = d(!1), f = u(t), p = u(n);
	f.current = t, p.current = n;
	let m = i(() => {
		l(!1);
	}, []);
	return {
		isPanLocked: c,
		panDrag: Et({
			disabled: c,
			svg: e,
			getCurrentDelta: r,
			setDelta: a,
			onCancel: () => a(0),
			onStart: s,
			onCommit: (e) => {
				l(!0), o(Ot(f.current, p.current, e));
			}
		}),
		unlockPan: m
	};
}
//#endregion
//#region src/browser/viewport/useRenderWindow.ts
function At(e, t, n) {
	return {
		targetRenderRegion: Dt(e, n),
		renderWidth: t * n
	};
}
function jt(e, t) {
	return JSON.stringify({
		region: e,
		trackIds: Mt(t)
	});
}
function Mt(e) {
	return JSON.stringify(e.map((e) => e.base.id).sort());
}
function Nt({ region: e, tracks: t, trackWidth: n, overscanMultiplier: r }) {
	let { targetRenderRegion: a, renderWidth: o } = c(() => At(e, n, r), [
		r,
		e,
		n
	]), [s, l] = d(a), f = c(() => jt(a, t), [a, t]), p = u(f);
	return p.current = f, {
		targetRenderRegion: a,
		displayedRenderRegion: s,
		renderWidth: o,
		dataKey: f,
		settleData: i((e) => e === p.current ? (l(a), !0) : !1, [a])
	};
}
//#endregion
//#region src/browser/GenomeBrowser.tsx
var Pt = 3;
function Ft({ browserStore: e, trackStore: t, settingsStore: n }) {
	let [r, a] = d(null), o = e((e) => e.region), s = e((e) => e.marginWidth), l = e((e) => e.trackWidth), u = e((e) => e.titleSize), f = e((e) => e.setRegion), p = t((e) => e.tracks), m = t((e) => e.registry), _ = c(() => ee(), []), v = c(() => Ne(), []), y = c(() => Me(), []), b = n ?? y, x = l, S = s + l, C = 80 + Xe(p, u), w = s - x, { getContentOffset: T, registerContentGroup: te, setContentOffset: E } = wt(w), { dataKey: re, displayedRenderRegion: ie, renderWidth: ae, settleData: D, targetRenderRegion: oe } = Nt({
		region: o,
		tracks: p,
		trackWidth: l,
		overscanMultiplier: Pt
	}), { isPanLocked: se, panDrag: ce, unlockPan: O } = kt({
		svg: r,
		region: o,
		trackWidth: l,
		getContentOffset: T,
		setContentOffset: E,
		setRegion: f,
		onPanStart: () => void 0
	}), k = i((e) => {
		D(e) && (E(0), O());
	}, [
		D,
		E,
		O
	]), { dataStates: ue, isFetching: fe } = ne({
		useDataStore: _,
		registry: m,
		tracks: p,
		region: oe,
		onSettled: () => k(re)
	}), A = se || fe;
	return /* @__PURE__ */ h(he, {
		value: c(() => ({
			browserStore: e,
			trackStore: t,
			contextMenuStore: v,
			settingsStore: b
		}), [
			b,
			e,
			v,
			t
		]),
		children: /* @__PURE__ */ h(ge, {
			value: c(() => ({ isInteractionBlocked: A }), [A]),
			children: /* @__PURE__ */ h(Be, {
				registry: m,
				children: /* @__PURE__ */ h(pe, {
					svg: r,
					children: /* @__PURE__ */ h(be, { children: /* @__PURE__ */ g(de, {
						isDisabled: ce.isDragging,
						getTooltipComponent: (e) => m.get(e).tooltipComponent,
						children: [
							/* @__PURE__ */ g(Je, {
								width: S,
								height: C,
								setSvg: a,
								children: [
									/* @__PURE__ */ g(St, {
										svg: r,
										marginWidth: s,
										trackWidth: l,
										totalHeight: C,
										region: o,
										setRegion: f,
										disabled: A,
										children: [
											/* @__PURE__ */ h("g", {
												transform: `translate(${s},0)`,
												children: /* @__PURE__ */ h(xt, {
													region: o,
													width: l
												})
											}),
											/* @__PURE__ */ h("g", { children: /* @__PURE__ */ h(gt, {
												tracks: p,
												dataStates: ue,
												region: ie,
												marginWidth: s,
												trackWidth: l,
												contentX: w,
												contentWidth: ae,
												registerContentGroup: te,
												panDrag: ce,
												isPanLocked: A,
												titleSize: u,
												startY: 80
											}) }),
											/* @__PURE__ */ h(Re, {
												region: ie,
												marginWidth: s,
												renderWidth: ae,
												contentX: w,
												browserWidth: S,
												totalHeight: C,
												registerContentGroup: te
											})
										]
									}),
									/* @__PURE__ */ h(le, {
										width: S,
										height: C
									}),
									/* @__PURE__ */ h(Fe, {
										active: A,
										width: S,
										height: C
									})
								]
							}),
							/* @__PURE__ */ h(He, {}),
							/* @__PURE__ */ h(qe, {})
						]
					}) })
				})
			})
		})
	});
}
//#endregion
//#region src/modules/defineTrackModule.ts
var It = p.strictObject({
	id: p.string().min(1),
	title: p.string().min(1),
	display: p.string().min(1),
	height: p.number().positive(),
	color: p.string().optional()
}), Lt = p.custom((e) => typeof e == "function", { error: "Input must be a function" }), Rt = p.strictObject({
	onClick: Lt.optional(),
	onHover: Lt.optional(),
	onLeave: Lt.optional()
});
function V(e) {
	return e === void 0 ? zt : zt(e);
}
function zt(e) {
	let t = e.configSchema.strict(), n = Object.keys(e.render);
	Vt(e.type, n);
	let r = e.defaults?.display ?? n[0];
	if (!n.includes(r)) throw Error(`Track module "${e.type}" default display "${r}" is not supported`);
	let i = p.enum(n), a = It.extend({ display: i }).strict(), o = p.strictObject({
		id: p.string().min(1),
		title: p.string().min(1),
		display: i.default(r),
		height: p.number().positive().default(e.defaults?.height ?? 80),
		color: p.string().optional(),
		config: t
	}), s = p.strictObject({
		type: p.literal(e.type),
		base: a,
		config: t,
		interaction: Rt.optional()
	});
	return Bt(e.type, e.defaults, r, a), {
		type: e.type,
		displays: n,
		configSchema: t,
		createInputSchema: o,
		create(t, n) {
			let r = B(o, t, `${e.type} input`), i = n === void 0 ? void 0 : B(Rt, n, `${e.type} interaction`);
			return {
				type: e.type,
				base: {
					id: r.id,
					title: r.title,
					display: r.display,
					height: r.height,
					color: r.color ?? e.defaults?.color
				},
				config: r.config,
				...i ? { interaction: i } : {}
			};
		},
		validate(t) {
			return B(s, t, `${e.type} instance`);
		},
		fetch: e.fetch,
		render: e.render,
		settingsComponent: e.settingsComponent,
		tooltipComponent: e.tooltipComponent
	};
}
function Bt(e, t, n, r) {
	B(r, {
		id: "__default_validation__",
		title: "Default validation",
		display: n,
		height: t?.height ?? 80,
		color: t?.color
	}, `${e} defaults`);
}
function Vt(e, t) {
	if (t.length === 0) throw Error(`Track module "${e}" must define at least one renderer`);
	for (let n of t) if (n.trim() === "") throw Error(`Track module "${e}" cannot define an empty display mode`);
}
//#endregion
//#region src/modules/registry.ts
function Ht(e) {
	let t = Object.freeze([...e]), n = /* @__PURE__ */ new Map();
	for (let e of t) {
		if (n.has(e.type)) throw Error(`Duplicate track module type: ${e.type}`);
		n.set(e.type, e);
	}
	function r(e) {
		let t = n.get(e);
		if (!t) throw Error(`No track module registered for type: ${e}`);
		return t;
	}
	return {
		modules: t,
		get: r
	};
}
function Ut(e, t) {
	let n = e.get(t.type), { type: r, metadata: i, ...a } = t;
	return n.create(a);
}
//#endregion
//#region src/browser/track-row/useAutoTrackHeight.ts
function Wt(e, t, { rowHeight: n = 12, minHeight: i = 30 } = {}) {
	let o = r(ye);
	if (!o) throw Error("useAutoTrackHeight must be used within a GenomeBrowser");
	let { getTrackHeight: s, updateHeight: c } = o, l = s(e);
	return a(() => {
		if (l === void 0) return;
		let r = Math.max(i, Math.max(1, t) * n);
		l !== r && c(e, r);
	}, [
		l,
		i,
		t,
		n,
		e,
		c
	]), n;
}
//#endregion
//#region src/browser/svg/useSvgPoint.ts
function Gt() {
	let e = A();
	return (t, n) => e ? R(e, t, n) : null;
}
//#endregion
//#region src/browser/tooltip/useTooltip.tsx
function H({ type: e, config: n }) {
	let r = O((e) => e.show), i = O((e) => e.hide), a = se(), o = ce(e), s = Gt(), c = u(void 0), l = () => {
		c.current !== void 0 && (cancelAnimationFrame(c.current), c.current = void 0), i();
	};
	return {
		hide: l,
		show: (e, i) => {
			if (a()) {
				l();
				return;
			}
			if (!o) return;
			let u = t(o, {
				item: e,
				config: n
			}), d = s(i.clientX, i.clientY) ?? {
				x: i.clientX,
				y: i.clientY
			};
			c.current !== void 0 && cancelAnimationFrame(c.current), c.current = requestAnimationFrame(() => {
				c.current = void 0, r(u, d);
			});
		}
	};
}
//#endregion
//#region src/browser/state/browserStore.ts
var Kt = p.object({
	id: p.string().min(1),
	region: p.object({
		chromosome: p.string().min(1).optional(),
		start: p.number().int(),
		end: p.number().int()
	}).refine((e) => e.start < e.end, {
		message: "start must be less than end",
		path: ["start"]
	}),
	color: p.string().min(1),
	opacity: p.number().min(0).max(1).optional()
}), qt = p.object({
	region: p.union([p.string().min(1), p.object({
		chromosome: p.string().min(1),
		start: p.number().int(),
		end: p.number().int()
	})]),
	marginWidth: p.number().positive().optional(),
	trackWidth: p.number().positive().optional(),
	fontSize: p.number().positive().optional(),
	titleSize: p.number().positive().optional(),
	highlights: p.array(Kt).optional()
});
function Jt(e) {
	let t = B(qt, e, "Browser store input");
	return f((e, n) => ({
		region: yt(t.region),
		marginWidth: t.marginWidth ?? 120,
		trackWidth: t.trackWidth ?? 1e3,
		fontSize: t.fontSize ?? 10,
		titleSize: t.titleSize ?? 12,
		highlights: t.highlights ?? [],
		setRegion: (t) => e({ region: yt(t) }),
		setTrackWidth: (t) => e({ trackWidth: t }),
		zoom: (t, r) => {
			if (t <= 0) throw Error("Zoom factor must be greater than 0");
			let i = n().region, a = r ?? Math.round((i.start + i.end) / 2), o = Math.max(1, Math.round((i.end - i.start) * t)), s = Math.max(0, Math.round(a - o / 2));
			e({ region: {
				chromosome: i.chromosome,
				start: s,
				end: s + o
			} });
		},
		addHighlight: (t) => {
			let r = B(Kt, t, "Highlight");
			n().highlights.some((e) => e.id === r.id) || e((e) => ({ highlights: [...e.highlights, r] }));
		},
		removeHighlight: (t) => {
			e((e) => ({ highlights: e.highlights.filter((e) => e.id !== t) }));
		}
	}));
}
//#endregion
//#region src/browser/state/trackStore.ts
function Yt(e) {
	let t = Ht(e.modules), n = Qt(e.tracks ?? [], t);
	return rn(n), f((e, r) => ({
		tracks: n,
		order: n.map(U),
		registry: t,
		setTracks: (n) => {
			let r = tn(n, t);
			if (!r.ok) return r;
			let i = nn(r.tracks);
			if (!i.ok) return i;
			let a = r.tracks;
			return e({
				tracks: a,
				order: a.map(U)
			}), W;
		},
		addTrack: (n, i) => {
			let a = en(n, t);
			if (!a.ok) return a;
			let o = a.track, s = [...r().tracks], c = U(o);
			return s.some((e) => U(e) === c) ? G(`Duplicate track id: ${c}`) : (s.splice(i ?? s.length, 0, o), e({
				tracks: s,
				order: s.map(U)
			}), W);
		},
		removeTrack: (t) => {
			if (!r().tracks.some((e) => U(e) === t)) return G(`No track found for id: ${t}`);
			let n = r().tracks.filter((e) => U(e) !== t);
			return e({
				tracks: n,
				order: n.map(U)
			}), W;
		},
		applyTrackChanges: (n) => {
			let i = tn(n.add ?? [], t);
			if (!i.ok) return i;
			let a = r().tracks, o = new Set(n.remove ?? []);
			for (let e of o) if (!a.some((t) => U(t) === e)) return G(`No track found for id: ${e}`);
			let s = [...a.filter((e) => !o.has(U(e))), ...i.tracks], c = nn(s);
			return c.ok ? (e({
				tracks: s,
				order: s.map(U)
			}), W) : c;
		},
		reorderTracks: (t) => {
			let n = new Map(r().tracks.map((e) => [U(e), e])), i = an(t, n);
			return i.ok ? (e({
				tracks: t.map((e) => n.get(e)),
				order: t
			}), W) : i;
		},
		updateBase: (n, i) => {
			let a = r().tracks.find((e) => U(e) === n);
			if (!a) return G(`No track found for id: ${n}`);
			let o = en({
				...a,
				base: {
					...a.base,
					...i,
					id: a.base.id
				}
			}, t);
			return o.ok ? (e((e) => ({
				tracks: e.tracks.map((e) => U(e) === n ? o.track : e),
				order: e.order
			})), W) : o;
		},
		updateConfig: (n, i) => {
			let a = r().tracks.find((e) => U(e) === n);
			if (!a) return G(`No track found for id: ${n}`);
			let o = Xt(a.config) ? a.config : {}, s = en({
				...a,
				config: {
					...o,
					...i
				}
			}, t);
			return s.ok ? (e((e) => ({
				tracks: e.tracks.map((e) => U(e) === n ? s.track : e),
				order: e.order
			})), W) : s;
		},
		updateInteraction: (n, i) => {
			let a = r().tracks.find((e) => U(e) === n);
			if (!a) return G(`No track found for id: ${n}`);
			let o = {
				...a.interaction,
				...i
			}, s = en({
				...a,
				interaction: o
			}, t);
			return s.ok ? (e((e) => ({
				tracks: e.tracks.map((e) => U(e) === n ? s.track : e),
				order: e.order
			})), W) : s;
		},
		getTrack: (e) => r().tracks.find((t) => U(t) === e)
	}));
}
function U(e) {
	return e.base.id;
}
function Xt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Zt(e, t) {
	return t.get(e.type).validate(e);
}
function Qt(e, t) {
	return e.map((e) => Zt(e, t));
}
var W = { ok: !0 };
function G(e) {
	return {
		ok: !1,
		error: e
	};
}
function $t(e) {
	return e instanceof Error ? e.message : "Unknown error";
}
function en(e, t) {
	try {
		return {
			ok: !0,
			track: Zt(e, t)
		};
	} catch (e) {
		return {
			ok: !1,
			error: $t(e)
		};
	}
}
function tn(e, t) {
	try {
		return {
			ok: !0,
			tracks: Qt(e, t)
		};
	} catch (e) {
		return {
			ok: !1,
			error: $t(e)
		};
	}
}
function nn(e) {
	try {
		return rn(e), W;
	} catch (e) {
		return G($t(e));
	}
}
function rn(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let e = U(n);
		if (t.has(e)) throw Error(`Duplicate track id: ${e}`);
		t.add(e);
	}
}
function an(e, t) {
	if (e.length !== t.size) return G("Invalid track order");
	let n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (n.has(r) || !t.has(r)) return G("Invalid track order");
		n.add(r);
	}
	return W;
}
//#endregion
//#region src/tracks/shared/TrackTooltip.tsx
var on = 6, sn = 4;
function K({ children: e }) {
	let t = u(null), [n, r] = d({
		x: 0,
		y: -14,
		width: 0,
		height: 18
	});
	return s(() => {
		if (!t.current) return;
		let e = t.current.getBBox();
		r({
			x: e.x,
			y: e.y,
			width: e.width,
			height: e.height
		});
	}, [e]), /* @__PURE__ */ g("g", {
		filter: "drop-shadow(0 0 2px #999999)",
		children: [/* @__PURE__ */ h("rect", {
			x: n.x - on,
			y: n.y - sn,
			width: n.width + on * 2,
			height: n.height + sn * 2,
			rx: 2,
			fill: "#ffffff",
			stroke: "#cccccc"
		}), /* @__PURE__ */ h("g", {
			ref: t,
			children: e
		})]
	});
}
//#endregion
//#region src/tracks/bigbed/schema.ts
function cn(e) {
	let t = Object.keys(e.shape);
	return (n, r, i, a) => {
		try {
			let o = [
				n,
				r,
				i,
				...a ? a.split("	") : []
			], s = {};
			return t.forEach((e, t) => {
				s[e] = o[t];
			}), ln(e.parse(s), n, r, i);
		} catch (e) {
			throw e instanceof p.ZodError ? Error(`BigBed row does not match schema: ${p.prettifyError(e)}`) : e;
		}
	};
}
function ln(e, t, n, r) {
	let i = un(e.start) ?? un(e.chromStart) ?? n, a = un(e.end) ?? un(e.chromEnd) ?? r, o = dn(e.chrom) ?? dn(e.chr) ?? t;
	return {
		...e,
		chrom: o,
		chr: dn(e.chr) ?? o,
		start: i,
		end: a
	};
}
function un(e) {
	return typeof e == "number" && !Number.isNaN(e) ? e : void 0;
}
function dn(e) {
	return typeof e == "string" ? e : void 0;
}
//#endregion
//#region src/tracks/bigbed/fetch.ts
async function fn({ config: e, region: t }) {
	return pn({
		url: e.url,
		region: t
	});
}
async function pn({ url: e, schema: t, region: n }) {
	await hn();
	let r = new b(new y(e, v.create()));
	if ((await r.getHeader()).fileType !== x.BigBed) throw Error("BigBed module only supports BigBed files");
	let i = t ? await r.readBigBedData(n.chromosome, n.start, n.chromosome, n.end, cn(t)) : await r.readBigBedData(n.chromosome, n.start, n.chromosome, n.end), a = [];
	for (let e of i) {
		let t = mn(e);
		t.end >= n.start && t.start <= n.end && a.push(t);
	}
	return a;
}
function mn(e) {
	return {
		...e,
		chr: e.chr ?? e.chrom,
		start: e.start ?? e.chromStart ?? 0,
		end: e.end ?? e.chromEnd ?? 0
	};
}
async function hn() {
	if (typeof window > "u" || globalThis.Buffer !== void 0) return;
	let { Buffer: e } = await import("buffer");
	globalThis.Buffer = e;
}
//#endregion
//#region src/tracks/bigbed/helpers.ts
function gn(e, t) {
	let n = e.toSorted((e, t) => e.start - t.start), r = [];
	for (let e of n) {
		let n = r[r.length - 1];
		!n || e.start > n.row.end || e.color !== n.row.color ? r.push({
			row: e,
			start: Math.max(0, t(e.start)),
			end: t(e.end),
			color: e.color,
			name: e.name,
			score: e.score
		}) : (n.end = t(e.end), n.row = {
			...n.row,
			end: e.end
		});
	}
	return r;
}
function _n(e, t) {
	return vn(e.toSorted((e, t) => e.start - t.start).map((e) => ({
		row: e,
		coordinates: {
			start: e.start,
			end: e.end
		},
		name: e.name ?? ""
	})), t, 0).map((e) => e.map((e) => ({
		row: e.row,
		start: Math.max(0, t(e.coordinates.start)),
		end: t(e.coordinates.end),
		color: e.row.color,
		name: e.row.name,
		score: e.row.score
	})));
}
function vn(e, t, n, r = 10) {
	return e.reduce((e, i) => {
		for (let a of e) {
			let o = a[a.length - 1];
			if (t(o.coordinates.end) + r + n * o.name.length <= t(i.coordinates.start)) return a.push(i), e;
		}
		return e.push([i]), e;
	}, []);
}
//#endregion
//#region src/tracks/bigbed/render.tsx
function yn({ config: e, color: t = "#4b9560", data: n, region: r, width: i, height: a }) {
	let o = gn(n, I(r, i)), s = a * .6, c = a * .2, l = z(), u = H({
		type: "bigbed",
		config: e
	});
	return /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("rect", {
		width: i,
		height: a,
		fill: "#ffffff",
		pointerEvents: "none"
	}), o.map((e, n) => /* @__PURE__ */ h("rect", {
		x: e.start,
		y: c,
		width: Math.max(1, e.end - e.start),
		height: s,
		fill: e.color ?? t,
		style: { cursor: l?.onClick ? "pointer" : "default" },
		onClick: () => l?.onClick?.(e.row),
		onMouseEnter: (t) => {
			l?.onHover?.(e.row), u.show(e.row, t);
		},
		onMouseLeave: () => {
			l?.onLeave?.(e.row), u.hide();
		}
	}, `${e.row.start}-${e.row.end}-${n}`))] });
}
function bn({ id: e, config: t, color: n = "#4b9560", data: r, region: i, width: a, height: o }) {
	let s = _n(r, I(i, a)), c = Wt(e, s.length), l = z(), u = H({
		type: "bigbed",
		config: t
	});
	return /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("rect", {
		width: a,
		height: o,
		fill: "#ffffff",
		pointerEvents: "none"
	}), s.map((e, t) => /* @__PURE__ */ h("g", {
		transform: `translate(0,${t * c})`,
		children: e.map((e, t) => /* @__PURE__ */ h("rect", {
			x: e.start,
			y: c * .2,
			width: Math.max(1, e.end - e.start),
			height: c * .6,
			fill: e.color ?? n,
			style: { cursor: l?.onClick ? "pointer" : "default" },
			onClick: () => l?.onClick?.(e.row),
			onMouseEnter: (t) => {
				l?.onHover?.(e.row), u.show(e.row, t);
			},
			onMouseLeave: () => {
				l?.onLeave?.(e.row), u.hide();
			}
		}, `${e.row.start}-${e.row.end}-${t}`))
	}, t))] });
}
//#endregion
//#region src/tracks/bigbed/settings.tsx
function xn({ config: e, updateConfig: t }) {
	return /* @__PURE__ */ h(F, {
		title: "BigBed",
		children: /* @__PURE__ */ g("label", {
			style: Sn,
			children: ["URL", /* @__PURE__ */ h("input", {
				type: "text",
				value: e.url,
				onChange: (e) => t({ url: e.target.value })
			})]
		})
	});
}
var Sn = {
	display: "grid",
	gap: "4px"
}, Cn = p.object({ url: C(p.string().min(1)) }), wn = V()({
	type: "bigbed",
	defaults: {
		height: 60,
		color: "#4b9560"
	},
	tooltipComponent: ({ item: e }) => /* @__PURE__ */ h(K, { children: /* @__PURE__ */ h("text", {
		fill: "#000000",
		fontSize: 12,
		dominantBaseline: "middle",
		children: e.name || `${e.start}-${e.end}`
	}) }),
	configSchema: Cn,
	fetch: fn,
	render: {
		dense: yn,
		squish: bn
	},
	settingsComponent: xn
});
//#endregion
//#region src/tracks/bigwig/fetch.ts
async function Tn({ config: e, region: t }) {
	return En({
		url: e.url,
		region: t
	});
}
async function En({ url: e, region: t }) {
	await Dn();
	let n = new b(new y(e, v.create()));
	if ((await n.getHeader()).fileType !== x.BigWig) throw Error("BigWig module only supports BigWig files");
	return await n.readBigWigData(t.chromosome, t.start, t.chromosome, t.end);
}
async function Dn() {
	if (typeof window > "u" || globalThis.Buffer !== void 0) return;
	let { Buffer: e } = await import("buffer");
	globalThis.Buffer = e;
}
//#endregion
//#region src/tracks/bigwig/helpers.ts
function On(e, t, n) {
	let r = Math.max(1, Math.floor(n)), i = Pn(r), a = (e) => (e - t.start) * r / (t.end - t.start);
	for (let n of e) {
		let e = Math.max(0, Math.min(r - 1, Math.floor(a(Math.max(n.start, t.start))))), o = Math.max(e, Math.min(r - 1, Math.floor(a(Math.min(n.end, t.end)))));
		for (let t = e; t <= o; t += 1) {
			let e = i[t];
			e.min = e.min === null ? n.value : Math.min(e.min, n.value), e.max = e.max === null ? n.value : Math.max(e.max, n.value);
		}
	}
	return i;
}
function kn(e) {
	let t = Infinity, n = -Infinity;
	for (let r of e) r.min !== null && (t = Math.min(t, r.min)), r.max !== null && (n = Math.max(n, r.max));
	return t === Infinity || n === -Infinity ? {
		min: 0,
		max: 1
	} : t === n ? {
		min: Math.min(0, t),
		max: n === 0 ? 1 : n
	} : {
		min: t,
		max: n
	};
}
function An(e) {
	for (let t of e) t.min === null && (t.min = 0), t.max === null && (t.max = 0);
}
function jn(e, t, n) {
	if (e.length === 0 || n <= 0) return;
	let r = e.length / n, i = e[Math.max(0, Math.min(e.length - 1, Math.round(t * r)))];
	if (!(!i || i.min === null && i.max === null)) return i;
}
function Mn(e, t) {
	let n = e.max - e.min;
	return (r) => n === 0 ? t : t - (r - e.min) * t / n;
}
function Nn(e, t) {
	let n = Fn(e), r = "#";
	for (let e = 0; e < 3; e += 1) {
		let i = Number.parseInt(n.slice(e * 2, e * 2 + 2), 16), a = Math.round(Math.min(Math.max(0, i + t * 255), 255)).toString(16);
		r += a.padStart(2, "0");
	}
	return r;
}
function Pn(e) {
	return Array.from({ length: e }, (e, t) => ({
		x: t,
		min: null,
		max: null
	}));
}
function Fn(e) {
	let t = e.replace(/[^0-9a-f]/gi, "");
	return t.length === 3 && (t = t.split("").map((e) => e + e).join("")), t.length >= 6 ? t.slice(0, 6) : "000000";
}
//#endregion
//#region src/tracks/bigwig/render.tsx
function In({ config: e, color: t = "#2266aa", data: n, width: r, height: i, region: a }) {
	let o = Bn(e, n, a, r), s = Vn(e, o), c = Mn(s, i)(q(0, s)), l = Hn(o, s, i);
	return /* @__PURE__ */ g("g", { children: [
		/* @__PURE__ */ h("rect", {
			width: r,
			height: i,
			fill: "#ffffff",
			pointerEvents: "none"
		}),
		/* @__PURE__ */ h("line", {
			x1: 0,
			x2: r,
			y1: c,
			y2: c,
			stroke: "#dddddd",
			strokeWidth: 1
		}),
		s.min < 0 && /* @__PURE__ */ h("path", {
			d: l.minPath,
			fill: Nn(t, .2)
		}),
		/* @__PURE__ */ h("path", {
			d: l.maxPath,
			fill: t
		}),
		/* @__PURE__ */ h("path", {
			d: l.clampHighPath,
			stroke: "#ff0000",
			strokeWidth: 2,
			fill: "none"
		}),
		/* @__PURE__ */ h("path", {
			d: l.clampLowPath,
			stroke: "#ff0000",
			strokeWidth: 2,
			fill: "none"
		}),
		/* @__PURE__ */ h(Rn, {
			config: e,
			points: o,
			width: r,
			height: i
		})
	] });
}
function Ln({ config: e, color: t = "#2266aa", data: n, width: r, height: i, region: a }) {
	let o = Bn(e, n, a, r), s = Vn(e, o), c = i / 3, l = i / 3;
	return /* @__PURE__ */ g("g", { children: [
		/* @__PURE__ */ h("rect", {
			width: r,
			height: i,
			fill: "#ffffff",
			pointerEvents: "none"
		}),
		o.map((e) => {
			let n = e.max ?? e.min, r = n === null ? 0 : (q(n, s) - s.min) / (s.max - s.min || 1);
			return /* @__PURE__ */ h("rect", {
				x: e.x,
				y: c,
				width: 1,
				height: l,
				fill: Nn(t, .65 - r * .65)
			}, e.x);
		}),
		/* @__PURE__ */ h(Rn, {
			config: e,
			points: o,
			width: r,
			height: i
		})
	] });
}
function Rn({ config: e, points: t, width: n, height: r }) {
	let [i, a] = d(), o = z(), s = H({
		type: "bigwig",
		config: e
	});
	return /* @__PURE__ */ g(m, { children: [i && /* @__PURE__ */ h("line", {
		x1: i.x,
		x2: i.x,
		y1: 0,
		y2: r,
		stroke: "#000000",
		strokeWidth: 1,
		pointerEvents: "none"
	}), /* @__PURE__ */ h("rect", {
		width: n,
		height: r,
		fill: "transparent",
		pointerEvents: "all",
		onMouseMove: (e) => {
			let r = jn(t, zn(e, n), n);
			if (!r) {
				i && o?.onLeave?.(i), a(void 0), s.hide();
				return;
			}
			a(r), o?.onHover?.(r), s.show(r, e);
		},
		onMouseOut: () => {
			i && o?.onLeave?.(i), a(void 0), s.hide();
		}
	})] });
}
function zn(e, t) {
	let n = e.currentTarget.getBoundingClientRect();
	return n.width <= 0 ? 0 : (e.clientX - n.left) / n.width * t;
}
function Bn(e, t, n, r) {
	let i = On(t, n, r);
	return e.fillWithZero && An(i), i;
}
function Vn(e, t) {
	return e.yRange ?? kn(t);
}
function Hn(e, t, n) {
	let r = Mn(t, n), i = r(q(0, t)), a = `M 0 ${i}`, o = `M 0 ${i}`, s = "", c = "";
	for (let l of e) {
		if (l.min === null || l.max === null) continue;
		let e = q(l.min, t), u = q(l.max, t), d = r(e), f = r(u), p = l.x + 1;
		a += ` L ${l.x} ${i} L ${l.x} ${d} L ${p} ${d} L ${p} ${i}`, o += ` L ${l.x} ${i} L ${l.x} ${f} L ${p} ${f} L ${p} ${i}`, l.max > t.max && (s += `M ${l.x} 0 l 0 2 `), l.min < t.min && (c += `M ${l.x} ${n} l 0 -2 `);
	}
	return {
		minPath: a,
		maxPath: o,
		clampHighPath: s,
		clampLowPath: c
	};
}
function q(e, t) {
	return Math.max(t.min, Math.min(t.max, e));
}
//#endregion
//#region src/tracks/bigwig/settings.tsx
function Un({ config: e, updateConfig: t }) {
	let n = u(null), r = u(null), i = () => {
		let e = n.current?.value ?? "", i = r.current?.value ?? "";
		if (e === "" || i === "") return;
		let a = Number(e), o = Number(i);
		Number.isFinite(a) && Number.isFinite(o) && a < o && t({ yRange: {
			min: a,
			max: o
		} });
	};
	return /* @__PURE__ */ g(F, {
		title: "BigWig",
		children: [
			/* @__PURE__ */ g("label", {
				style: {
					display: "grid",
					gap: "4px"
				},
				children: ["URL", /* @__PURE__ */ h("input", {
					type: "text",
					value: e.url,
					onChange: (e) => t({ url: e.target.value })
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: "6px"
				},
				children: [/* @__PURE__ */ h("input", {
					type: "checkbox",
					checked: e.fillWithZero ?? !1,
					onChange: (e) => t({ fillWithZero: e.target.checked })
				}), "Fill missing values with zero"]
			}),
			/* @__PURE__ */ g("div", {
				style: {
					display: "grid",
					gap: "6px"
				},
				children: [
					/* @__PURE__ */ h("div", {
						style: { fontWeight: 600 },
						children: "Y range"
					}),
					/* @__PURE__ */ g("div", {
						style: {
							display: "flex",
							gap: "6px"
						},
						children: [/* @__PURE__ */ h("input", {
							type: "number",
							step: "any",
							"aria-label": "Minimum Y range",
							placeholder: "min",
							defaultValue: e.yRange?.min ?? "",
							ref: n,
							onChange: i
						}), /* @__PURE__ */ h("input", {
							type: "number",
							step: "any",
							"aria-label": "Maximum Y range",
							placeholder: "max",
							defaultValue: e.yRange?.max ?? "",
							ref: r,
							onChange: i
						})]
					}),
					/* @__PURE__ */ h("div", {
						style: {
							display: "flex",
							gap: "6px"
						},
						children: /* @__PURE__ */ h("button", {
							type: "button",
							onClick: () => {
								n.current && (n.current.value = ""), r.current && (r.current.value = ""), t({ yRange: void 0 });
							},
							children: "Auto scale"
						})
					})
				]
			})
		]
	});
}
//#endregion
//#region src/tracks/bigwig/module.tsx
var Wn = p.object({
	min: p.number(),
	max: p.number()
}).refine((e) => e.min < e.max, {
	error: "min must be less than max",
	path: ["min"]
}), Gn = p.object({
	url: C(p.string().min(1)),
	fillWithZero: p.boolean().default(!1),
	yRange: Wn.optional()
}), Kn = V()({
	type: "bigwig",
	defaults: {
		height: 80,
		color: "#2266aa"
	},
	tooltipComponent: ({ item: e }) => /* @__PURE__ */ h(K, { children: /* @__PURE__ */ h("text", {
		fill: "#000000",
		fontSize: 12,
		dominantBaseline: "middle",
		children: e.max?.toFixed(2)
	}) }),
	configSchema: Gn,
	fetch: Tn,
	render: {
		full: In,
		dense: Ln
	},
	settingsComponent: Un
}), qn = "https://screen.api.wenglab.org/graphql", Jn = "api_sk_p4mf_1eRcHWwMB6xt_WBuVwF7hI6UnbG", Yn = "\n  query Gene($chromosome: String, $assembly: String!, $start: Int, $end: Int, $version: Int) {\n    gene(assembly: $assembly, chromosome: $chromosome, start: $start, end: $end, version: $version) {\n      strand\n      name\n      id\n      transcripts {\n        coordinates {\n          start\n          end\n        }\n        name\n        id\n        exons {\n          coordinates {\n            start\n            end\n          }\n          UTRs {\n            coordinates {\n              start\n              end\n            }\n          }\n        }\n        tag\n      }\n    }\n  }\n";
async function Xn({ config: e, region: t }) {
	let n = await fetch(qn, {
		method: "POST",
		headers: {
			authorization: `Bearer ${Jn}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			query: Yn,
			variables: {
				chromosome: t.chromosome,
				assembly: e.assembly,
				start: t.start,
				end: t.end,
				version: e.version
			}
		})
	});
	if (!n.ok) throw Error(`Transcript request failed with ${n.status}`);
	let r = await n.json();
	if (r.errors?.length) throw Error(r.errors.map((e) => e.message ?? "GraphQL error").join("; "));
	if (!r.data) throw Error("Transcript response did not include data");
	return r.data.gene ?? [];
}
//#endregion
//#region src/tracks/transcript/helpers.ts
function Zn(e) {
	return !!e?.includes("MANE_Select");
}
function Qn(e) {
	let t = e.transcripts.flatMap((e) => e.exons ?? []).toSorted(cr), n = nr(t), r = t.map((e) => e.coordinates.start), i = t.map((e) => e.coordinates.end);
	return {
		name: e.name ?? "",
		strand: e.strand,
		id: e.id ?? "",
		coordinates: {
			start: r.length ? Math.min(...r) : 0,
			end: i.length ? Math.max(...i) : 0
		},
		exons: n,
		color: ""
	};
}
function $n(e) {
	return e.flatMap((e) => e.transcripts.map((t) => ({
		...t,
		strand: e.strand
	}))).sort((e, t) => e.coordinates.start - t.coordinates.start);
}
function er(e, t, n, r) {
	let i = ir(e, t);
	return {
		transcript: i,
		paths: {
			exons: i.exons?.reduce((e, t) => e + or(t, n / 2, n, r), "") ?? "",
			introns: ar(i.coordinates.start, i.coordinates.end, i.strand, n / 2, n * .19, r)
		}
	};
}
function tr(e, t, n, r = 10) {
	return e.reduce((e, i) => {
		for (let a of e) {
			let o = a[a.length - 1], s = o.coordinates.end;
			if (t(s) + r + n * o.name.length <= t(i.coordinates.start)) return a.push(i), e;
		}
		return e.push([i]), e;
	}, []);
}
function nr(e) {
	if (e.length === 0) return [];
	let t = [{
		coordinates: { ...e[0].coordinates },
		UTRs: e[0].UTRs && [...e[0].UTRs]
	}];
	for (let n of e.slice(1)) {
		let e = t[t.length - 1], r = e.coordinates.end;
		n.coordinates.start < r ? (e.UTRs = [...e.UTRs ?? [], ...n.UTRs ?? []], e.coordinates.end = Math.max(r, n.coordinates.end)) : t.push({
			coordinates: { ...n.coordinates },
			UTRs: n.UTRs && [...n.UTRs]
		});
	}
	for (let e of t) e.UTRs = rr(e.UTRs ?? []);
	return t;
}
function rr(e) {
	if (e.length === 0) return [];
	let t = e.toSorted(cr), n = [{ coordinates: { ...t[0].coordinates } }];
	for (let e of t.slice(1)) {
		let t = n[n.length - 1], r = t.coordinates.end;
		e.coordinates.start < r ? t.coordinates.end = Math.max(r, e.coordinates.end) : n.push({ coordinates: { ...e.coordinates } });
	}
	return n;
}
function ir(e, t) {
	return {
		...e,
		coordinates: {
			start: t(e.coordinates.start),
			end: t(e.coordinates.end)
		},
		exons: e.exons?.map((e) => ({
			coordinates: {
				start: t(e.coordinates.start),
				end: t(e.coordinates.end)
			},
			UTRs: e.UTRs?.map((e) => ({ coordinates: {
				start: t(e.coordinates.start),
				end: t(e.coordinates.end)
			} })) ?? []
		})) ?? []
	};
}
function ar(e, t, n, r, i, a) {
	let o = "", s = Math.max(0, e), c = Math.min(a, t);
	if (n === "+") for (let e = s + 10; e < c - 10; e += 20) o += J(e - i, r - i) + Y(e, r) + Y(e - i, r + i) + Y(e, r) + Y(e - i, r - i);
	else if (n === "-") for (let e = s + 10; e < c - 10; e += 20) o += J(e + i, r - i) + Y(e, r) + Y(e + i, r + i) + Y(e, r) + Y(e + i, r - i);
	return `${o} M ${s} ${r} L ${c} ${r}`;
}
function or(e, t, n, r) {
	if (e.coordinates.start > r || e.coordinates.end < 0) return "";
	let i = e.UTRs?.filter((t) => t.coordinates.start === e.coordinates.start) ?? [], a = e.UTRs?.filter((t) => t.coordinates.end === e.coordinates.end) ?? [], o = t - n * .2, s = t + n * .2, c = t - n * .3, l = t + n * .3;
	if (!i[0] && !a[0]) return sr(e.coordinates.start, c, e.coordinates.end, l);
	if (i[0] && i[0].coordinates.end === e.coordinates.end) return sr(i[0].coordinates.start, o, i[0].coordinates.end, s);
	let u = i[0] ? J(i[0].coordinates.start, o) + Y(i[0].coordinates.end, o) + Y(i[0].coordinates.end, c) : J(e.coordinates.start, c);
	return u += a[0] ? Y(a[0].coordinates.start, c) + Y(a[0].coordinates.start, o) + Y(a[0].coordinates.end, o) + Y(a[0].coordinates.end, s) + Y(a[0].coordinates.start, s) + Y(a[0].coordinates.start, l) : Y(e.coordinates.end, c) + Y(e.coordinates.end, l), u + (i[0] ? Y(i[0].coordinates.end, l) + Y(i[0].coordinates.end, s) + Y(i[0].coordinates.start, s) + Y(i[0].coordinates.start, o) : Y(e.coordinates.start, l) + Y(e.coordinates.start, c));
}
function sr(e, t, n, r) {
	return J(e, t) + Y(n, t) + Y(n, r) + Y(e, r) + Y(e, t);
}
function cr(e, t) {
	return e.coordinates.start === t.coordinates.start ? e.coordinates.end - t.coordinates.end : e.coordinates.start - t.coordinates.start;
}
function J(e, t) {
	return ` M ${e} ${t}`;
}
function Y(e, t) {
	return ` L ${e} ${t}`;
}
//#endregion
//#region src/tracks/transcript/render.tsx
var lr = 10;
function ur(e) {
	let t = [];
	for (let n of e.data) {
		let r = Qn(n);
		mr(r, e.region) && t.push(r);
	}
	return /* @__PURE__ */ h(fr, {
		...e,
		transcripts: t
	});
}
function dr(e) {
	let t = $n(e.data).filter((t) => mr(t, e.region));
	return /* @__PURE__ */ h(fr, {
		...e,
		transcripts: t
	});
}
function fr({ id: e, config: t, color: n = "#7a4fb3", region: r, width: i, height: a, transcripts: o }) {
	let s = I(r, i), c = tr(o, s, lr), l = Wt(e, c.length), u = c.map((e, t) => ({
		y: t * l,
		transcripts: e.map((e) => er(e, s, l, i))
	})), d = z(), f = H({
		type: "transcript",
		config: t
	});
	return /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("rect", {
		width: i,
		height: a,
		fill: "#ffffff",
		pointerEvents: "none"
	}), u.map((e, r) => /* @__PURE__ */ h("g", {
		transform: `translate(0,${e.y})`,
		children: e.transcripts.map((e, r) => {
			let i = pr(t, e.transcript, n);
			return /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("path", {
				stroke: i,
				fill: i,
				strokeWidth: Math.max(.5, l / 16),
				d: e.paths.introns + e.paths.exons,
				style: { cursor: d?.onClick ? "pointer" : "default" },
				onClick: () => d?.onClick?.(e.transcript),
				onMouseEnter: (t) => {
					d?.onHover?.(e.transcript), f.show(e.transcript, t);
				},
				onMouseLeave: () => {
					d?.onLeave?.(e.transcript), f.hide();
				}
			}), /* @__PURE__ */ h("text", {
				fill: i,
				fontSize: lr,
				x: e.transcript.coordinates.end + 5,
				y: l / 2,
				dominantBaseline: "middle",
				pointerEvents: "none",
				style: { userSelect: "none" },
				children: e.transcript.name
			})] }, `${e.transcript.id}-${r}`);
		})
	}, r))] });
}
function pr(e, t, n) {
	return Zn(t.tag) ? e.canonicalColor ?? n : e.geneName && t.name.toLowerCase().includes(e.geneName.toLowerCase()) ? e.highlightColor ?? n : t.color || n;
}
function mr(e, t) {
	return e.coordinates.end >= t.start && e.coordinates.start <= t.end;
}
//#endregion
//#region src/tracks/transcript/settings.tsx
function hr({ config: e, updateConfig: t }) {
	return /* @__PURE__ */ g(F, {
		title: "Transcript",
		children: [
			/* @__PURE__ */ g("label", {
				style: {
					display: "grid",
					gap: "4px"
				},
				children: ["Highlight gene", /* @__PURE__ */ h("input", {
					type: "text",
					value: e.geneName ?? "",
					onChange: (e) => t({ geneName: e.target.value || void 0 })
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: {
					display: "grid",
					gap: "4px"
				},
				children: ["Assembly", /* @__PURE__ */ h("input", {
					type: "text",
					value: e.assembly,
					onChange: (e) => t({ assembly: e.target.value })
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: {
					display: "grid",
					gap: "4px"
				},
				children: ["Version", /* @__PURE__ */ h("input", {
					type: "number",
					min: 1,
					step: 1,
					value: e.version,
					onChange: (e) => {
						let n = Number(e.target.value);
						Number.isInteger(n) && n > 0 && t({ version: n });
					}
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: {
					display: "grid",
					gap: "4px"
				},
				children: ["Canonical color", /* @__PURE__ */ h("input", {
					type: "text",
					value: e.canonicalColor ?? "",
					placeholder: "#000000",
					onChange: (e) => t({ canonicalColor: e.target.value || void 0 })
				})]
			}),
			/* @__PURE__ */ g("label", {
				style: {
					display: "grid",
					gap: "4px"
				},
				children: ["Highlight color", /* @__PURE__ */ h("input", {
					type: "text",
					value: e.highlightColor ?? "",
					placeholder: "#000000",
					onChange: (e) => t({ highlightColor: e.target.value || void 0 })
				})]
			})
		]
	});
}
//#endregion
//#region src/tracks/transcript/module.tsx
var gr = p.object({
	assembly: C(p.string().min(1)),
	version: C(p.number().int().positive()),
	geneName: p.string().optional(),
	canonicalColor: p.string().optional(),
	highlightColor: p.string().optional()
}), _r = V()({
	type: "transcript",
	defaults: {
		height: 90,
		color: "#7a4fb3"
	},
	tooltipComponent: ({ item: e }) => /* @__PURE__ */ h(K, { children: /* @__PURE__ */ h("text", {
		fill: "#000000",
		fontSize: 12,
		dominantBaseline: "middle",
		children: e.name || e.id
	}) }),
	configSchema: gr,
	fetch: Xn,
	render: {
		squish: ur,
		pack: dr
	},
	settingsComponent: hr
});
//#endregion
//#region src/tracks/bulkbed/fetch.ts
async function vr({ config: e, region: t }) {
	return Promise.all(e.datasets.map(async (e, n) => (await pn({
		url: e.url,
		region: t
	})).map((t) => ({
		...t,
		datasetName: e.name || `Dataset ${n + 1}`
	}))));
}
//#endregion
//#region src/tracks/bulkbed/render.tsx
function yr({ config: e, color: t = "#4b9560", data: n, region: r, width: i, height: a }) {
	let o = I(r, i), s = e.gap ?? 2, c = s * Math.max(0, n.length - 1), l = n.length > 0 ? Math.max(1, (a - c) / n.length) : a, u = z(), d = H({
		type: "bulkbed",
		config: e
	});
	return /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("rect", {
		width: i,
		height: a,
		fill: "#ffffff",
		pointerEvents: "none"
	}), n.map((n, r) => {
		let i = e.datasets[r]?.name || `Dataset ${r + 1}`, a = r * (l + s), c = gn(n, o);
		return /* @__PURE__ */ h("g", {
			transform: `translate(0,${a})`,
			children: c.map((e, n) => {
				let r = typeof e.row.datasetName == "string" ? e.row.datasetName : void 0, a = {
					...e.row,
					datasetName: r ?? i
				};
				return /* @__PURE__ */ h("rect", {
					x: e.start,
					y: 0,
					width: Math.max(1, e.end - e.start),
					height: l,
					fill: e.color ?? t,
					style: { cursor: u?.onClick ? "pointer" : "default" },
					onClick: () => u?.onClick?.(a),
					onMouseEnter: (e) => {
						u?.onHover?.(a), d.show(a, e);
					},
					onMouseLeave: () => {
						u?.onLeave?.(a), d.hide();
					}
				}, `${a.start}-${a.end}-${n}`);
			})
		}, i);
	})] });
}
//#endregion
//#region src/tracks/bulkbed/settings.tsx
function br({ config: e, updateConfig: t }) {
	let n = u([]), r = u(0);
	for (; n.current.length < e.datasets.length;) n.current.push(`bulkbed-dataset-${r.current++}`);
	n.current.length > e.datasets.length && (n.current = n.current.slice(0, e.datasets.length));
	let i = e.datasets.length === 0 || e.datasets.some((e) => e.name.trim() === "" || e.url.trim() === "");
	return /* @__PURE__ */ g(F, {
		title: "BulkBed",
		children: [/* @__PURE__ */ g("label", {
			style: Sr,
			children: ["Gap", /* @__PURE__ */ h("input", {
				type: "number",
				min: 0,
				step: 1,
				value: e.gap ?? 0,
				onChange: (e) => {
					let n = Number(e.target.value);
					Number.isFinite(n) && n >= 0 && t({ gap: n });
				}
			})]
		}), /* @__PURE__ */ g("div", {
			style: {
				display: "grid",
				gap: "8px"
			},
			children: [
				/* @__PURE__ */ h("div", {
					style: { fontWeight: 600 },
					children: "Datasets"
				}),
				e.datasets.map((r, i) => /* @__PURE__ */ g("div", {
					style: Cr,
					children: [
						/* @__PURE__ */ g("label", {
							style: Sr,
							children: ["Name", /* @__PURE__ */ h("input", {
								type: "text",
								value: r.name,
								onChange: (n) => t({ datasets: xr(e.datasets, i, "name", n.target.value) })
							})]
						}),
						/* @__PURE__ */ g("label", {
							style: Sr,
							children: ["URL", /* @__PURE__ */ h("input", {
								type: "text",
								value: r.url,
								onChange: (n) => t({ datasets: xr(e.datasets, i, "url", n.target.value) })
							})]
						}),
						/* @__PURE__ */ h("button", {
							type: "button",
							disabled: e.datasets.length === 1,
							onClick: () => {
								n.current = n.current.filter((e, t) => t !== i), t({ datasets: e.datasets.filter((e, t) => t !== i) });
							},
							children: "Remove"
						})
					]
				}, n.current[i])),
				/* @__PURE__ */ h("div", {
					style: {
						display: "flex",
						gap: "6px"
					},
					children: /* @__PURE__ */ h("button", {
						type: "button",
						onClick: () => {
							n.current.push(`bulkbed-dataset-${r.current++}`), t({ datasets: [...e.datasets, {
								name: `Dataset ${e.datasets.length + 1}`,
								url: "YOUR_URL_HERE"
							}] });
						},
						children: "Add dataset"
					})
				}),
				i && /* @__PURE__ */ h("div", {
					style: { color: "#b00020" },
					children: "Dataset names and URLs are required."
				})
			]
		})]
	});
}
function xr(e, t, n, r) {
	return e.map((e, i) => i === t ? {
		...e,
		[n]: r
	} : e);
}
var Sr = {
	display: "grid",
	gap: "4px"
}, Cr = {
	display: "grid",
	gap: "6px",
	padding: "8px",
	border: "1px solid #d0d0d0",
	borderRadius: "4px"
}, wr = p.object({
	name: p.string().min(1),
	url: C(p.string().min(1))
}), Tr = p.object({
	datasets: p.array(wr).min(1),
	gap: p.number().nonnegative().optional()
}), Er = V()({
	type: "bulkbed",
	defaults: {
		height: 80,
		color: "#4b9560"
	},
	tooltipComponent: ({ item: e }) => /* @__PURE__ */ h(K, { children: /* @__PURE__ */ h("text", {
		fill: "#000000",
		fontSize: 12,
		dominantBaseline: "middle",
		children: e.name || e.datasetName || `${e.start}-${e.end}`
	}) }),
	configSchema: Tr,
	fetch: vr,
	render: { full: yr },
	settingsComponent: br
});
//#endregion
//#region src/tracks/methylc/fetch.ts
async function Dr({ config: e, region: t }) {
	return Promise.all([
		X(e.urls.plusStrand.cpg.url, t),
		X(e.urls.plusStrand.chg.url, t),
		X(e.urls.plusStrand.chh.url, t),
		X(e.urls.plusStrand.depth.url, t),
		X(e.urls.minusStrand.cpg.url, t),
		X(e.urls.minusStrand.chg.url, t),
		X(e.urls.minusStrand.chh.url, t),
		X(e.urls.minusStrand.depth.url, t)
	]);
}
async function X(e, t) {
	if (!e) return [];
	await Or();
	let n = new b(new y(e, v.create()));
	if ((await n.getHeader()).fileType !== x.BigWig) throw Error("MethylC module only supports BigWig files");
	return await n.readBigWigData(t.chromosome, t.start, t.chromosome, t.end);
}
async function Or() {
	if (typeof window > "u" || globalThis.Buffer !== void 0) return;
	let { Buffer: e } = await import("buffer");
	globalThis.Buffer = e;
}
//#endregion
//#region src/tracks/methylc/helpers.tsx
function kr(e, t, n) {
	return e.map((e) => e.length > 0 ? On(e, t, n) : []);
}
function Z(e, t, n, r = !1, i, a, o = !1) {
	let s = Mr(e, i);
	if (!s) return null;
	let { range: c, rangeSize: l } = s, u = r ? 0 : t, d = Fr(0, u), f = Fr(0, u);
	return e.forEach((e, n) => {
		if (e.min === null || e.max === null || o && !Pr(a?.[n])) return;
		let i = Nr(e, c, l, t, r);
		f += Q(e.x, u) + Q(i.x, r ? t : 0) + Q(i.x + 1, r ? t : 0) + Q(e.x + 1, u), d += Q(e.x, u) + Q(i.x, i.y) + Q(i.x + 1, i.y) + Q(e.x + 1, u);
	}), {
		indicator: /* @__PURE__ */ h("path", {
			d: f,
			fill: n,
			fillOpacity: .2
		}),
		values: /* @__PURE__ */ h("path", {
			d,
			fill: n
		})
	};
}
function Ar(e, t, n, r = !1, i) {
	let a = Mr(e, i);
	if (!a) return null;
	let { range: o, rangeSize: s } = a, c = "", l = !1;
	return e.forEach((e) => {
		if (e.min === null || e.max === null) return;
		let n = Nr(e, o, s, t, r);
		l ? c += Q(n.x, n.y) : (c += Fr(n.x, n.y), l = !0);
	}), c ? /* @__PURE__ */ h("path", {
		d: c,
		stroke: n,
		fill: "none",
		strokeWidth: "1"
	}) : null;
}
function jr(e) {
	let t = Infinity, n = -Infinity;
	for (let r of e) for (let e of r) e.min !== null && (t = Math.min(t, e.min)), e.max !== null && (n = Math.max(n, e.max));
	return t === Infinity || n === -Infinity ? {
		min: 0,
		max: 1
	} : t === n ? {
		min: Math.min(0, t),
		max: n === 0 ? 1 : n
	} : {
		min: t,
		max: n
	};
}
function Mr(e, t) {
	if (!e || e.length === 0) return null;
	let n = t || jr([e]), r = n.max - n.min;
	return r <= 0 ? null : {
		range: n,
		rangeSize: r
	};
}
function Nr(e, t, n, r, i) {
	let a = e.max ?? t.min, o = (Math.max(t.min, Math.min(t.max, a)) - t.min) / n * r;
	return {
		x: e.x,
		y: i ? o : r - o
	};
}
function Pr(e) {
	return e != null && e.max != null && e.max > 0;
}
function Fr(e, t) {
	return `M ${e} ${t}`;
}
function Q(e, t) {
	return ` L ${e} ${t}`;
}
//#endregion
//#region src/tracks/methylc/render.tsx
function Ir({ id: e, config: t, data: n, region: r, width: i, height: a }) {
	let o = c(() => kr(n, r, i), [
		n,
		r,
		i
	]), s = a / 2, l = c(() => jr([
		o[0],
		o[1],
		o[2],
		o[4],
		o[5],
		o[6]
	]), [o]), u = t.range || l, d = c(() => jr([o[3], o[7]]), [o]), f = c(() => ({
		cpgPlus: Z(o[0], s, t.colors.cpg, !1, u, o[3], t.maskCpgByCoverage),
		chgPlus: Z(o[1], s, t.colors.chg, !1, u),
		chhPlus: Z(o[2], s, t.colors.chh, !1, u),
		depthPlus: Ar(o[3], s, t.colors.depth, !1, d),
		cpgMinus: Z(o[4], s, t.colors.cpg, !0, u, o[7], t.maskCpgByCoverage),
		chgMinus: Z(o[5], s, t.colors.chg, !0, u),
		chhMinus: Z(o[6], s, t.colors.chh, !0, u),
		depthMinus: Ar(o[7], s, t.colors.depth, !0, d)
	}), [
		t.colors,
		t.maskCpgByCoverage,
		d,
		u,
		s,
		o
	]), p = c(() => ({
		fwdCpg: !!t.urls.plusStrand.cpg.url,
		fwdChg: !!t.urls.plusStrand.chg.url,
		fwdChh: !!t.urls.plusStrand.chh.url,
		fwdDepth: !!t.urls.plusStrand.depth.url,
		revCpg: !!t.urls.minusStrand.cpg.url,
		revChg: !!t.urls.minusStrand.chg.url,
		revChh: !!t.urls.minusStrand.chh.url,
		revDepth: !!t.urls.minusStrand.depth.url
	}), [t.urls]);
	return /* @__PURE__ */ g("g", { children: [
		/* @__PURE__ */ h("rect", {
			width: i,
			height: a,
			fill: "#ffffff",
			pointerEvents: "none"
		}),
		/* @__PURE__ */ g("g", {
			id: `${e}-plusStrand`,
			children: [
				f.cpgPlus?.indicator,
				f.chgPlus?.indicator,
				f.chhPlus?.indicator,
				f.cpgPlus?.values,
				f.chgPlus?.values,
				f.chhPlus?.values,
				f.depthPlus
			]
		}),
		/* @__PURE__ */ g("g", {
			id: `${e}-minusStrand`,
			transform: `translate(0, ${s})`,
			children: [
				f.cpgMinus?.indicator,
				f.chgMinus?.indicator,
				f.chhMinus?.indicator,
				f.cpgMinus?.values,
				f.chgMinus?.values,
				f.chhMinus?.values,
				f.depthMinus
			]
		}),
		/* @__PURE__ */ h(Lr, {
			config: t,
			data: o,
			showRows: p,
			width: i,
			height: a
		})
	] });
}
function Lr({ config: e, data: t, showRows: n, width: r, height: i }) {
	let [a, o] = d(), s = z(), l = H({
		type: "methylc",
		config: e
	}), u = c(() => a === void 0 ? [] : t.map((e) => e[a]), [t, a]);
	return /* @__PURE__ */ g(m, { children: [a !== void 0 && /* @__PURE__ */ h("line", {
		stroke: "#000000",
		x1: a,
		x2: a,
		y1: 0,
		y2: i,
		pointerEvents: "none"
	}), /* @__PURE__ */ h("rect", {
		width: r,
		height: i,
		fill: "transparent",
		pointerEvents: "all",
		onMouseMove: (e) => {
			let i = Rr(e, r), a = {
				tooltipValues: t.map((e) => e[i]),
				showRows: n
			};
			o(i), s?.onHover?.(a), l.show(a, e);
		},
		onMouseOut: () => {
			s?.onLeave?.({
				tooltipValues: u,
				showRows: n
			}), o(void 0), l.hide();
		}
	})] });
}
function Rr(e, t) {
	let n = e.currentTarget.getBoundingClientRect(), r = n.width <= 0 ? 0 : (e.clientX - n.left) / n.width * t;
	return Math.max(0, Math.min(Math.max(0, Math.floor(t) - 1), Math.round(r)));
}
//#endregion
//#region src/tracks/methylc/tooltip.tsx
function zr({ item: e }) {
	return /* @__PURE__ */ h(K, { children: /* @__PURE__ */ h("g", { children: Br(e).map((e, t) => /* @__PURE__ */ g("text", {
		y: t * 14,
		fill: "#000000",
		fontSize: 12,
		dominantBaseline: "middle",
		children: [
			e.label,
			": ",
			e.value
		]
	}, e.label)) }) });
}
function Br({ showRows: e, tooltipValues: t }) {
	return [
		{
			key: "fwdCpg",
			label: "Fwd CpG",
			value: $(t[0])
		},
		{
			key: "fwdChg",
			label: "Fwd CHG",
			value: $(t[1])
		},
		{
			key: "fwdChh",
			label: "Fwd CHH",
			value: $(t[2])
		},
		{
			key: "fwdDepth",
			label: "Fwd depth",
			value: $(t[3])
		},
		{
			key: "revCpg",
			label: "Rev CpG",
			value: $(t[4])
		},
		{
			key: "revChg",
			label: "Rev CHG",
			value: $(t[5])
		},
		{
			key: "revChh",
			label: "Rev CHH",
			value: $(t[6])
		},
		{
			key: "revDepth",
			label: "Rev depth",
			value: $(t[7])
		}
	].filter((t) => e[t.key]);
}
function $(e) {
	return !e || e.max === null ? "n/a" : e.max.toFixed(2);
}
//#endregion
//#region src/tracks/methylc/module.ts
var Vr = {
	cpg: "#648bd8",
	chg: "#ff944d",
	chh: "#ff00ff",
	depth: "#525252"
}, Hr = p.object({
	min: p.number(),
	max: p.number()
}).refine((e) => e.min < e.max, {
	error: "min must be less than max",
	path: ["min"]
}), Ur = p.object({ url: C(p.string()) }), Wr = p.object({
	cpg: Ur,
	chg: Ur,
	chh: Ur,
	depth: Ur
}), Gr = p.object({
	urls: p.object({
		plusStrand: Wr,
		minusStrand: Wr
	}),
	colors: p.object({
		cpg: p.string().default(Vr.cpg),
		chg: p.string().default(Vr.chg),
		chh: p.string().default(Vr.chh),
		depth: p.string().default(Vr.depth)
	}).default(Vr),
	maskCpgByCoverage: p.boolean().default(!1),
	range: Hr.optional()
}), Kr = V()({
	type: "methylc",
	defaults: { height: 100 },
	tooltipComponent: zr,
	configSchema: Gr,
	fetch: Dr,
	render: { split: Ir }
});
//#endregion
//#region src/tracks/cave/render.tsx
function qr({ config: e, color: t = "#3333ff", data: n, width: r, height: i, region: a }) {
	let o = {
		min: 0,
		max: 1
	}, s = On(n.top, a, r), c = On(n.bottom, a, r), l = Jr(s, o, i, "top"), u = Jr(c, o, i, "bottom");
	return /* @__PURE__ */ g("g", { children: [
		/* @__PURE__ */ h("rect", {
			width: r,
			height: i,
			fill: "#ffffff",
			pointerEvents: "none"
		}),
		/* @__PURE__ */ h("line", {
			x1: 0,
			x2: r,
			y1: i / 2,
			y2: i / 2,
			stroke: "#dddddd",
			strokeWidth: 1
		}),
		/* @__PURE__ */ h("path", {
			d: l,
			fill: Nn(t, .4)
		}),
		/* @__PURE__ */ h("path", {
			d: u,
			fill: t
		}),
		/* @__PURE__ */ h(Xr, {
			config: e,
			topPoints: s,
			bottomPoints: c,
			width: r,
			height: i
		})
	] });
}
function Jr(e, t, n, r) {
	let i = r === "top" ? 0 : n, a = `M 0 ${i}`;
	for (let o of e) {
		if (o.max === null) continue;
		let e = Yr(o.max, t, n, r), s = o.x + 1;
		a += ` L ${o.x} ${i} L ${o.x} ${e} L ${s} ${e} L ${s} ${i}`;
	}
	return a;
}
function Yr(e, t, n, r) {
	let i = t.max - t.min || 1, a = (Qr(e, t) - t.min) / i;
	return r === "top" ? a * n : n - a * n;
}
function Xr({ config: e, topPoints: t, bottomPoints: n, width: r, height: i }) {
	let [a, o] = d(), s = u(void 0), c = z(), l = H({
		type: "cave",
		config: e
	});
	return /* @__PURE__ */ g(m, { children: [a !== void 0 && /* @__PURE__ */ h("line", {
		x1: a,
		x2: a,
		y1: 0,
		y2: i,
		stroke: "#000000",
		strokeWidth: 1,
		pointerEvents: "none"
	}), /* @__PURE__ */ h("rect", {
		width: r,
		height: i,
		fill: "transparent",
		pointerEvents: "all",
		onMouseMove: (e) => {
			let i = Zr(e, r), u = jn(t, i, r), d = jn(n, i, r);
			if (!u && !d) {
				s.current && c?.onLeave?.(s.current), s.current = void 0, a !== void 0 && o(void 0), l.hide();
				return;
			}
			let f = Math.round(i), p = {
				x: f,
				top: u,
				bottom: d
			};
			s.current = p, a !== f && o(f), c?.onHover?.(p), l.show(p, e);
		},
		onMouseOut: () => {
			s.current && c?.onLeave?.(s.current), s.current = void 0, o(void 0), l.hide();
		}
	})] });
}
function Zr(e, t) {
	let n = e.currentTarget.getBoundingClientRect();
	return n.width <= 0 ? 0 : (e.clientX - n.left) / n.width * t;
}
function Qr(e, t) {
	return Math.max(t.min, Math.min(t.max, e));
}
//#endregion
//#region src/tracks/cave/fetch.ts
var $r = "https://users.wenglab.org/phanh/PsychENCODE/hg38/", ei = "data/brainome/Methylation_BS_OXBS_bw/";
async function ti({ config: e, region: t }) {
	let n = ni(e.neurotransmitter, "hmC", e.age), r = ni(e.neurotransmitter, "OXBS", e.age), [i, a] = await Promise.all([En({
		url: n,
		region: t
	}), En({
		url: r,
		region: t
	})]);
	return {
		top: i,
		bottom: a
	};
}
function ni(e, t, n) {
	return `${$r}${ei}${e}_${t}_${n}.CGN-both.frac.cov5.bw`;
}
//#endregion
//#region src/tracks/cave/module.tsx
var ri = p.object({
	neurotransmitter: C(p.enum(["GABA", "GLU"])),
	age: C(p.enum([
		"Infancy",
		"Early_Childhood",
		"Late_Childhood",
		"Adolescence",
		"Early_Adulthood",
		"Adulthood"
	]))
}), ii = V()({
	type: "cave",
	defaults: {
		height: 35,
		color: "#3333ff"
	},
	tooltipComponent: ({ item: e }) => /* @__PURE__ */ g(K, { children: [/* @__PURE__ */ g("text", {
		fill: "#000000",
		fontSize: 12,
		dominantBaseline: "middle",
		children: ["hmC: ", ai(e.top)]
	}), /* @__PURE__ */ g("text", {
		fill: "#000000",
		fontSize: 12,
		y: 12,
		dominantBaseline: "middle",
		children: ["OXBS: ", ai(e.bottom)]
	})] }),
	configSchema: ri,
	fetch: ti,
	render: { full: qr }
});
function ai(e) {
	return e?.max === null || e?.max === void 0 ? "n/a" : e.max.toFixed(2);
}
//#endregion
export { yn as DenseBigBed, Ft as GenomeBrowser, F as SettingsSection, bn as SquishBigBed, it as TrackInteractionProvider, wn as bigBedModule, Kn as bigWigModule, Er as bulkBedModule, ii as caveModule, Jt as createBrowserStore, Ne as createContextMenuStore, Ht as createModuleRegistry, Me as createSettingsStore, Ut as createTrackFromEntry, Yt as createTrackStore, V as defineTrackModule, pn as fetchBigBedRows, C as fetchOnChange, Kr as methylCModule, _r as transcriptModule, Wt as useAutoTrackHeight, _e as useBrowserStore, N as useContextMenuStore, Ee as useDraggableSettingsModal, z as useInteraction, Ve as useRegistry, P as useSettingsStore, H as useTooltip, M as useTrackStore };

//# sourceMappingURL=genomebrowser-v2.es.js.map