import { n as e, t } from "./generateJsonSchema-C3H4YL2B.js";
import { LicenseInfo as n } from "@mui/x-license";
import { createContext as r, use as i, useMemo as a, useState as o } from "react";
import s from "@mui/material/Button";
import c from "@mui/material/Dialog";
import l from "@mui/material/DialogActions";
import u from "@mui/material/DialogContent";
import d from "@mui/material/DialogContentText";
import f from "@mui/material/DialogTitle";
import { Fragment as p, jsx as m, jsxs as h } from "react/jsx-runtime";
import { createTrackFromEntry as ee } from "@weng-lab/genomebrowser-v2";
import g from "@mui/material/Box";
import _ from "@mui/material/Stack";
import v from "@mui/material/Paper";
import { DataGridPremium as y } from "@mui/x-data-grid-premium";
import b from "@mui/material/Typography";
import x from "@mui/material/CardActionArea";
import S from "@mui/material/Avatar";
import { SimpleTreeView as C } from "@mui/x-tree-view/SimpleTreeView";
import w from "@mui/icons-material/Category";
import T from "@mui/icons-material/IndeterminateCheckBoxRounded";
import E from "@mui/material/IconButton";
import D from "@mui/material/Tooltip";
import { TreeItem as O } from "@mui/x-tree-view/TreeItem";
import k from "@mui/material/Alert";
import A from "@mui/material/MenuItem";
import j from "@mui/material/Select";
import te from "@mui/icons-material/Close";
//#region src/muiLicense.ts
n.setLicenseKey("a8a7caa0861db35745fbff677471cad5Tz0xMjMzMTQsRT0xNzk3NTUxOTk5MDAwLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y");
//#endregion
//#region src/TrackSelect/catalog/catalogRows.ts
function M(e, t) {
	return `${e}::${t}`;
}
function N(e) {
	return e.tracks.map((t) => ({
		...t.metadata,
		id: M(e.id, t.id),
		title: t.title,
		type: t.type,
		track: t
	}));
}
function P(e) {
	return new Set(e.tracks.map((t) => M(e.id, t.id)));
}
function ne(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) for (let e of n.tracks) t.set(M(n.id, e.id), e);
	return t;
}
function re(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (t.has(r.id)) throw Error(`Duplicate track catalog id: ${r.id}`);
		t.add(r.id);
		for (let e of r.tracks) {
			let t = M(r.id, e.id);
			if (n.has(t)) throw Error(`Duplicate catalog track id: ${t}`);
			n.add(t);
		}
	}
}
//#endregion
//#region src/TrackSelect/dialogs/confirmDialog.tsx
function F({ open: e, title: t, text: n, confirmLabel: r = "OK", cancelLabel: i = "Cancel", onClose: a, onConfirm: o }) {
	return /* @__PURE__ */ h(c, {
		open: e,
		onClose: a,
		children: [
			/* @__PURE__ */ m(f, { children: t }),
			/* @__PURE__ */ m(u, { children: /* @__PURE__ */ m(d, { children: n }) }),
			/* @__PURE__ */ h(l, { children: [o ? /* @__PURE__ */ m(s, {
				onClick: a,
				children: i
			}) : null, /* @__PURE__ */ m(s, {
				color: o ? "secondary" : "primary",
				variant: "contained",
				onClick: o ?? a,
				children: r
			})] })
		]
	});
}
//#endregion
//#region src/TrackSelect/session/trackSelectContext.tsx
var I = r(void 0);
function L({ value: e, children: t }) {
	return /* @__PURE__ */ m(I, {
		value: e,
		children: t
	});
}
function R() {
	let e = i(I);
	if (!e) throw Error("TrackSelect components must be rendered inside TrackSelectProvider");
	return e;
}
//#endregion
//#region src/TrackSelect/catalog/catalogGrouping.ts
function z(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = B(i[t], n(i)), a = r.get(e);
		a ? a.push(i) : r.set(e, [i]);
	}
	return r;
}
function B(e, t) {
	return e == null || e === "" ? t : String(e);
}
//#endregion
//#region src/TrackSelect/catalog/catalogOrder.ts
function V(e, t, n) {
	return ie(N(e).filter((e) => n.has(e.id)), t.grouping);
}
function ie(e, t) {
	return t.length === 0 ? e : H(e, t, 0);
}
function H(e, t, n) {
	if (n >= t.length) return e;
	let r = z(e, t[n], (e) => e.id);
	return Array.from(r.values()).flatMap((e) => H(e, t, n + 1));
}
//#endregion
//#region src/TrackSelect/catalog/catalogViews.ts
function ae(e) {
	return new Map(e.map((e) => [e.id, e.views[0].id]));
}
function U(e, t) {
	return e.views.find((n) => n.id === t.get(e.id)) ?? e.views[0];
}
//#endregion
//#region src/TrackSelect/catalog/catalogDiff.ts
function oe({ trackCatalogs: e, tracks: t, selectedByCatalog: n, activeViewIdByCatalog: r }) {
	let i = ne(e), a = /* @__PURE__ */ new Set();
	for (let e of t) i.has(e.base.id) && a.add(e.base.id);
	let o = /* @__PURE__ */ new Set(), s = [];
	for (let t of e) {
		let e = n.get(t.id) ?? /* @__PURE__ */ new Set();
		for (let t of e) o.add(t);
		let i = U(t, r);
		for (let n of V(t, i, e)) a.has(n.id) || s.push({
			id: n.id,
			track: n.track
		});
	}
	return {
		idsToRemove: Array.from(a).filter((e) => !o.has(e)),
		tracksToAdd: s
	};
}
//#endregion
//#region src/TrackSelect/catalog/catalogSelection.ts
function se(e) {
	return new Map(e.map((e) => [e.id, /* @__PURE__ */ new Set()]));
}
function W(e, t) {
	let n = se(e), r = new Set(t.map((e) => e.base.id));
	for (let t of e) {
		let e = n.get(t.id);
		for (let n of t.tracks) {
			let i = M(t.id, n.id);
			r.has(i) && e.add(i);
		}
	}
	return n;
}
function G(e) {
	let t = 0;
	for (let n of e.values()) t += n.size;
	return t;
}
function K(e) {
	return new Map(Array.from(e, ([e, t]) => [e, new Set(t)]));
}
function ce(e, t, n) {
	let r = K(e);
	return r.set(t, new Set(n)), r;
}
function le(e, t, n) {
	let r = K(t);
	if (n) return r.set(n, /* @__PURE__ */ new Set()), r;
	for (let t of e) r.set(t.id, /* @__PURE__ */ new Set());
	return r;
}
function ue(e, t) {
	let n = new Set(t), r = K(e);
	for (let [e, t] of r) r.set(e, new Set(Array.from(t).filter((e) => !n.has(e))));
	return r;
}
//#endregion
//#region src/TrackSelect/session/useTrackSelectState.ts
function de({ trackCatalogs: e, tracks: t, registry: n, applyTrackChanges: r, maxTracks: i, onClose: a }) {
	let [s, c] = o(() => e.length === 1 ? "catalog-detail" : "catalog-list"), [l, u] = o(() => e[0]?.id ?? ""), [d, f] = o(() => ae(e)), [p, m] = o(() => W(e, t)), [h, g] = o(!1), [_, v] = o(), y = fe(s, e.length), b = e.find((e) => e.id === l) ?? e[0], x = b ? U(b, d) : void 0, S = G(p);
	function C(e) {
		u(e), c("catalog-detail");
	}
	function w(e) {
		b && f((t) => {
			let n = new Map(t);
			return n.set(b.id, e), n;
		});
	}
	function T(e) {
		let t = G(p), n = G(e);
		if (n > i && n > t) {
			g(!0);
			return;
		}
		v(void 0), m(e);
	}
	function E(e) {
		b && T(ce(p, b.id, e));
	}
	function D() {
		T(le(e, p, y === "catalog-detail" ? b?.id : void 0));
	}
	function O() {
		v(void 0), m(W(e, t));
	}
	function k(e) {
		T(ue(p, e));
	}
	function A() {
		v(void 0);
		let { idsToRemove: i, tracksToAdd: o } = oe({
			trackCatalogs: e,
			tracks: t,
			selectedByCatalog: p,
			activeViewIdByCatalog: d
		}), s;
		try {
			s = o.map(({ id: e, track: t }) => ee(n, {
				...t,
				id: e
			}));
		} catch (e) {
			v(pe(e));
			return;
		}
		let c = r({
			add: s,
			remove: i
		});
		if (!c.ok) {
			v(c.error);
			return;
		}
		a();
	}
	return {
		state: {
			trackCatalogs: e,
			screen: y,
			activeCatalog: b,
			activeView: x,
			activeViewIdByCatalog: d,
			selectedByCatalog: p,
			selectedTrackCount: S,
			limitDialogOpen: h,
			submitError: _
		},
		actions: {
			selectCatalog: C,
			backToCatalogs: () => c("catalog-list"),
			selectView: w,
			selectActiveCatalogTracks: E,
			removeSelectedTrackIds: k,
			clearDraftSelection: D,
			resetDraftSelection: O,
			submitSelection: A,
			cancel: a,
			closeLimitDialog: () => g(!1)
		},
		meta: { maxTracks: i }
	};
}
function fe(e, t) {
	return t === 0 ? "catalog-list" : t === 1 ? "catalog-detail" : e;
}
function pe(e) {
	return e instanceof Error ? e.message : "Unknown Track Select error";
}
//#endregion
//#region src/TrackSelect/layout/trackSelectActionBar.tsx
function me() {
	let [e, t] = o(null), { state: n, actions: r } = R(), i = n.screen === "catalog-list", a = n.activeCatalog?.label ?? "tracks";
	function c() {
		r.clearDraftSelection(), t(null);
	}
	function l() {
		r.resetDraftSelection(), t(null);
	}
	return /* @__PURE__ */ h(p, { children: [
		/* @__PURE__ */ h(g, {
			sx: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				mt: 2,
				gap: 1
			},
			children: [/* @__PURE__ */ h(g, {
				sx: {
					display: "flex",
					gap: 1
				},
				children: [/* @__PURE__ */ m(s, {
					variant: "outlined",
					color: "secondary",
					size: "small",
					onClick: () => t("clear"),
					children: "Clear"
				}), /* @__PURE__ */ m(s, {
					variant: "outlined",
					color: "secondary",
					size: "small",
					onClick: () => t("reset"),
					children: "Reset"
				})]
			}), /* @__PURE__ */ h(g, {
				sx: {
					display: "flex",
					gap: 1
				},
				children: [/* @__PURE__ */ m(s, {
					variant: "outlined",
					size: "small",
					onClick: r.cancel,
					children: "Cancel"
				}), /* @__PURE__ */ m(s, {
					variant: "contained",
					size: "small",
					onClick: r.submitSelection,
					children: "Submit"
				})]
			})]
		}),
		/* @__PURE__ */ m(F, {
			open: e === "clear",
			title: "Clear selected tracks?",
			text: i ? "This will clear all selected catalog tracks from the draft." : `This will clear selected tracks from ${a}.`,
			confirmLabel: "Clear",
			onClose: () => t(null),
			onConfirm: c
		}),
		/* @__PURE__ */ m(F, {
			open: e === "reset",
			title: "Reset selection?",
			text: "This will reset the draft selection back to the current track store.",
			confirmLabel: "Reset",
			onClose: () => t(null),
			onConfirm: l
		})
	] });
}
//#endregion
//#region src/TrackSelect/trackSelectEmptyPanel.tsx
function q({ children: e }) {
	return /* @__PURE__ */ m(v, {
		variant: "outlined",
		sx: {
			height: 500,
			borderWidth: 2
		},
		children: /* @__PURE__ */ m(b, {
			color: "text.secondary",
			sx: { p: 3 },
			children: e
		})
	});
}
//#endregion
//#region src/TrackSelect/catalog/catalogGrid.tsx
var he = {
	id: "ID",
	title: "Title",
	type: "Type"
};
function ge({ catalog: e, view: t, selectedIds: n, onSelectionChange: r }) {
	return !e || !t ? /* @__PURE__ */ m(q, { children: "No track catalog selected." }) : /* @__PURE__ */ m(_e, {
		catalog: e,
		view: t,
		selectedIds: n,
		onSelectionChange: r
	}, `${e.id}:${t.id}`);
}
function _e({ catalog: e, view: t, selectedIds: n, onSelectionChange: r }) {
	let i = a(() => N(e), [e]), s = a(() => P(e), [e]), c = a(() => ye(t), [t]), [l, u] = o(() => xe(t));
	return /* @__PURE__ */ m(v, {
		sx: { width: "100%" },
		children: /* @__PURE__ */ m(g, {
			sx: {
				height: 500,
				width: "100%",
				overflow: "auto"
			},
			children: /* @__PURE__ */ m(y, {
				rows: i,
				columns: c,
				getRowId: ve,
				rowGroupingModel: t.grouping,
				groupingColDef: {
					leafField: t.leaf,
					display: "flex",
					minWidth: 300,
					maxWidth: 500,
					flex: 2
				},
				columnVisibilityModel: l,
				onColumnVisibilityModelChange: u,
				onRowSelectionModelChange: (e) => {
					let t = e.ids ?? /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
					for (let e of t) typeof e == "string" && s.has(e) && n.add(e);
					r(n);
				},
				rowSelectionModel: {
					type: "include",
					ids: n
				},
				rowSelectionPropagation: {
					descendants: !0,
					parents: !1
				},
				keepNonExistentRowsSelected: !0,
				showToolbar: !0,
				checkboxSelection: !0,
				disableAggregation: !0,
				disablePivoting: !0,
				disableRowSelectionExcludeModel: !0,
				hideFooterSelectedRowCount: !0,
				pagination: !0
			})
		})
	});
}
function ve(e) {
	return e.id;
}
function ye(e) {
	let t = new Map(e.columns.map((e) => [e.field, e]));
	return Se(e).map((e) => be(e, t.get(e)));
}
function be(e, t) {
	return {
		field: e,
		headerName: t?.label ?? he[e] ?? e,
		description: t?.description,
		width: t?.width,
		flex: t?.width ? void 0 : 1,
		minWidth: 120
	};
}
function xe(e) {
	let t = { id: !1 };
	for (let n of e.columns) n.hidden && (t[n.field] = !1);
	for (let n of e.grouping) t[n] = !1;
	return e.grouping.length > 0 && (t[e.leaf] = !1), t;
}
function Se(e) {
	return [...new Set([
		"id",
		...e.columns.map((e) => e.field),
		...e.grouping,
		e.leaf
	])];
}
//#endregion
//#region src/TrackSelect/catalogList/catalogCard.tsx
function Ce({ catalog: e, onClick: t }) {
	return /* @__PURE__ */ m(v, {
		elevation: 1,
		sx: {
			transition: "all 0.2s ease-in-out",
			"&:hover": {
				boxShadow: 3,
				bgcolor: "action.hover"
			}
		},
		children: /* @__PURE__ */ h(x, {
			onClick: t,
			sx: {
				display: "block",
				p: 3
			},
			children: [
				/* @__PURE__ */ m(b, {
					variant: "h6",
					gutterBottom: !0,
					children: e.label
				}),
				e.description ? /* @__PURE__ */ m(b, {
					variant: "body2",
					color: "text.secondary",
					gutterBottom: !0,
					children: e.description
				}) : null,
				/* @__PURE__ */ h(b, {
					variant: "caption",
					color: "text.secondary",
					children: [e.tracks.length.toLocaleString(), " tracks available"]
				})
			]
		})
	});
}
//#endregion
//#region src/TrackSelect/catalogList/catalogList.tsx
function we({ catalogs: e, onCatalogSelect: t }) {
	return e.length === 0 ? /* @__PURE__ */ m(q, { children: "No track catalogs available" }) : /* @__PURE__ */ m(v, {
		variant: "outlined",
		sx: {
			height: 500,
			overflow: "auto",
			borderWidth: 2
		},
		children: /* @__PURE__ */ m(_, {
			spacing: 2,
			sx: { p: 2 },
			children: e.map((e) => /* @__PURE__ */ m(Ce, {
				catalog: e,
				onClick: () => t(e.id)
			}, e.id))
		})
	});
}
//#endregion
//#region src/TrackSelect/selectedTracksTree/buildSelectedTree.ts
function Te({ catalog: e, view: t, selectedIds: n }) {
	let r = V(e, t, n);
	if (r.length === 0) return;
	let i = J({
		rows: r,
		grouping: t.grouping,
		leafField: t.leaf,
		catalogId: e.id,
		depth: 0,
		path: []
	});
	return {
		id: `${e.id}::root`,
		label: e.label,
		kind: "root",
		trackIds: r.map((e) => e.id),
		children: i
	};
}
function J({ rows: e, grouping: t, leafField: n, catalogId: r, depth: i, path: a }) {
	if (i >= t.length) return e.map((e) => ({
		id: `${r}::leaf::${e.id}`,
		label: B(e[n], e.title),
		kind: "leaf",
		trackIds: [e.id]
	}));
	let o = t[i], s = z(e, o, (e) => e.id);
	return Array.from(s, ([e, s]) => {
		let c = [...a, `${o}=${encodeURIComponent(e)}`];
		return {
			id: `${r}::group::${c.join("::")}`,
			label: e,
			kind: "group",
			trackIds: s.map((e) => e.id),
			children: J({
				rows: s,
				grouping: t,
				leafField: n,
				catalogId: r,
				depth: i + 1,
				path: c
			})
		};
	});
}
//#endregion
//#region src/TrackSelect/selectedTracksTree/selectedTreeItem.tsx
function Y({ node: e, onRemove: t }) {
	return /* @__PURE__ */ m(O, {
		itemId: e.id,
		label: /* @__PURE__ */ m(Ee, {
			node: e,
			onRemove: t
		}),
		children: e.children?.map((e) => /* @__PURE__ */ m(Y, {
			node: e,
			onRemove: t
		}, e.id))
	});
}
function Ee({ node: e, onRemove: t }) {
	return /* @__PURE__ */ h(g, {
		sx: {
			display: "flex",
			alignItems: "center",
			minWidth: 0,
			gap: 1
		},
		children: [e.kind === "root" ? /* @__PURE__ */ m(w, { fontSize: "small" }) : /* @__PURE__ */ m(E, {
			"aria-label": `Remove ${e.label}`,
			size: "small",
			onClick: (n) => {
				n.stopPropagation(), t(e.trackIds);
			},
			sx: {
				p: .25,
				borderRadius: 1
			},
			children: /* @__PURE__ */ m(T, { fontSize: "small" })
		}), /* @__PURE__ */ m(D, {
			title: e.label,
			enterDelay: 500,
			placement: "top",
			children: /* @__PURE__ */ m(b, {
				variant: "body2",
				fontWeight: 500,
				sx: {
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap"
				},
				children: e.label
			})
		})]
	});
}
//#endregion
//#region src/TrackSelect/selectedTracksTree/selectedTracksTree.tsx
function De({ trackCatalogs: e, selectedByCatalog: t, activeViewIdByCatalog: n, selectedCount: r, onRemoveTrackIds: i }) {
	let o = a(() => e.flatMap((e) => {
		let r = t.get(e.id) ?? /* @__PURE__ */ new Set(), i = Te({
			catalog: e,
			view: U(e, n),
			selectedIds: r
		});
		return i ? [i] : [];
	}), [
		n,
		t,
		e
	]);
	return /* @__PURE__ */ h(v, {
		sx: {
			height: 500,
			width: "100%",
			border: "10px solid",
			borderColor: "grey.200",
			boxSizing: "border-box",
			borderRadius: 2,
			display: "flex",
			flexDirection: "column"
		},
		children: [/* @__PURE__ */ h(g, {
			sx: {
				display: "flex",
				alignItems: "center",
				gap: 1,
				py: 1,
				backgroundColor: "grey.200",
				flexShrink: 0
			},
			children: [/* @__PURE__ */ m(S, {
				sx: {
					width: 30,
					height: 30,
					fontSize: 14,
					fontWeight: "bold",
					bgcolor: "white",
					color: "text.primary"
				},
				children: r
			}), /* @__PURE__ */ m(b, {
				fontWeight: "bold",
				children: "Active Tracks"
			})]
		}), /* @__PURE__ */ m(g, {
			sx: {
				flex: 1,
				overflow: "auto",
				p: 1
			},
			children: o.length > 0 ? /* @__PURE__ */ m(C, {
				itemChildrenIndentation: 12,
				children: o.map((e) => /* @__PURE__ */ m(Y, {
					node: e,
					onRemove: i
				}, e.id))
			}) : /* @__PURE__ */ m(b, {
				color: "text.secondary",
				variant: "body2",
				sx: { p: 2 },
				children: "No selected tracks."
			})
		})]
	});
}
//#endregion
//#region src/TrackSelect/layout/trackSelectBody.tsx
function Oe() {
	let { state: e, actions: t } = R(), { trackCatalogs: n, screen: r, activeCatalog: i, activeView: a, activeViewIdByCatalog: o, selectedByCatalog: s, selectedTrackCount: c } = e;
	return /* @__PURE__ */ h(_, {
		direction: {
			xs: "column",
			md: "row"
		},
		spacing: 2,
		sx: { width: "100%" },
		children: [/* @__PURE__ */ m(g, {
			sx: {
				flex: {
					xs: "none",
					md: 3
				},
				minWidth: 0,
				width: {
					xs: "100%",
					md: "auto"
				}
			},
			children: r === "catalog-list" ? /* @__PURE__ */ m(we, {
				catalogs: n,
				onCatalogSelect: t.selectCatalog
			}) : /* @__PURE__ */ m(ge, {
				catalog: i,
				view: a,
				selectedIds: ke(i, s),
				onSelectionChange: t.selectActiveCatalogTracks
			})
		}), /* @__PURE__ */ m(g, {
			sx: {
				flex: {
					xs: "none",
					md: 2
				},
				minWidth: 0,
				width: {
					xs: "100%",
					md: "auto"
				}
			},
			children: /* @__PURE__ */ m(De, {
				trackCatalogs: n,
				selectedByCatalog: s,
				activeViewIdByCatalog: o,
				selectedCount: c,
				onRemoveTrackIds: t.removeSelectedTrackIds
			})
		})]
	});
}
function ke(e, t) {
	return e ? t.get(e.id) ?? /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set();
}
//#endregion
//#region src/TrackSelect/layout/trackSelectSubmitError.tsx
function Ae() {
	let { state: e } = R();
	return e.submitError ? /* @__PURE__ */ m(k, {
		severity: "error",
		sx: { mt: 2 },
		children: e.submitError
	}) : null;
}
//#endregion
//#region src/TrackSelect/layout/trackSelectToolbar.tsx
function je() {
	let { state: e, actions: t } = R(), { trackCatalogs: n, screen: r, activeCatalog: i, activeView: a } = e;
	function o(e) {
		t.selectView(e.target.value);
	}
	return /* @__PURE__ */ h(g, {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		sx: { mb: 2 },
		children: [r === "catalog-detail" && n.length > 1 ? /* @__PURE__ */ m(s, {
			size: "small",
			onClick: t.backToCatalogs,
			children: "Back to Catalogs"
		}) : /* @__PURE__ */ m(g, {}), r === "catalog-detail" && i && a ? /* @__PURE__ */ m(j, {
			size: "small",
			value: a.id,
			onChange: o,
			sx: { minWidth: 180 },
			children: i.views.map((e) => /* @__PURE__ */ m(A, {
				value: e.id,
				children: e.label
			}, e.id))
		}) : null]
	});
}
//#endregion
//#region src/TrackSelect/layout/trackSelectContent.tsx
function Me(e) {
	return /* @__PURE__ */ h(L, {
		value: de(e),
		children: [
			/* @__PURE__ */ m(je, {}),
			/* @__PURE__ */ m(Oe, {}),
			/* @__PURE__ */ m(Ae, {}),
			/* @__PURE__ */ m(me, {}),
			/* @__PURE__ */ m(Ne, {})
		]
	});
}
function Ne() {
	let { state: e, actions: t, meta: n } = R();
	return /* @__PURE__ */ m(F, {
		open: e.limitDialogOpen,
		title: "Track limit reached",
		text: `Select ${n.maxTracks.toLocaleString()} tracks or fewer.`,
		onClose: t.closeLimitDialog
	});
}
//#endregion
//#region src/TrackSelect/layout/trackSelectHeader.tsx
function Pe({ title: e, onClose: t }) {
	return /* @__PURE__ */ h(f, {
		sx: {
			bgcolor: "primary.main",
			color: "primary.contrastText",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			fontWeight: "bold"
		},
		children: [e, /* @__PURE__ */ m(E, {
			"aria-label": "Close track select",
			size: "large",
			onClick: t,
			sx: {
				color: "primary.contrastText",
				p: 0
			},
			children: /* @__PURE__ */ m(te, { fontSize: "large" })
		})]
	});
}
//#endregion
//#region src/TrackSelect/layout/trackSelectDialog.tsx
function Fe({ open: e, title: t, onClose: n, children: r }) {
	return /* @__PURE__ */ h(c, {
		open: e,
		onClose: n,
		maxWidth: "lg",
		fullWidth: !0,
		children: [/* @__PURE__ */ m(Pe, {
			title: t,
			onClose: n
		}), /* @__PURE__ */ m(u, {
			sx: { mt: 1 },
			children: /* @__PURE__ */ m(g, {
				sx: {
					flex: 1,
					pt: 1
				},
				children: r
			})
		})]
	});
}
//#endregion
//#region src/TrackSelect/schema/validateJson.ts
var Ie = new Set([
	"id",
	"title",
	"type"
]);
function Le(e) {
	return e.issues.map((e) => `${e.path.join(".") || "catalog"}: ${e.message}`).join("; ");
}
function X(t, n) {
	let r = e(n).safeParse(t);
	if (!r.success) throw Error(`TrackSelect catalog is invalid: ${Le(r.error)}`);
	let i = Z(t) && Array.isArray(t.tracks) ? t.tracks : [];
	return {
		...r.data,
		tracks: r.data.tracks.map((e, t) => {
			let n = i[t];
			return Z(n) ? {
				...n,
				metadata: e.metadata
			} : e;
		})
	};
}
function Z(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Q(e, t, n, r) {
	Ie.has(t) || e.tracks.forEach((e, i) => {
		t in e.metadata || r.push(`tracks.${i}.metadata is missing "${t}" required by ${n}`);
	});
}
function Re(e, t, n) {
	Q(e, t.leaf, `views.${t.id}.leaf`, n);
}
function $(e, t) {
	let n = X(e, t), r = [];
	if (n.views.forEach((e) => {
		e.columns.forEach((t) => {
			Q(n, t.field, `views.${e.id}.columns.${t.field}`, r);
		}), e.grouping.forEach((t) => {
			Q(n, t, `views.${e.id}.grouping`, r);
		}), Re(n, e, r);
	}), r.length > 0) throw Error(`TrackSelect catalog is invalid: ${r.join("; ")}`);
	return n;
}
//#endregion
//#region src/TrackSelect/TrackSelect.tsx
var ze = "Track Select", Be = 50;
function Ve({ open: e, onClose: t, trackCatalogs: n, useTrackStore: r, title: i = ze, maxTracks: o = Be }) {
	let s = r((e) => e.registry), c = r((e) => e.tracks), l = r((e) => e.applyTrackChanges), u = a(() => {
		let e = n.map((e) => $(e, s));
		return re(e), e;
	}, [n, s]), d = a(() => He(u), [u]);
	return /* @__PURE__ */ m(Fe, {
		open: e,
		title: i,
		onClose: t,
		children: e ? /* @__PURE__ */ m(Me, {
			trackCatalogs: u,
			tracks: c,
			registry: s,
			applyTrackChanges: l,
			maxTracks: o,
			onClose: t
		}, d) : null
	});
}
function He(e) {
	return e.map((e) => {
		let t = e.views.map((e) => e.id).join(","), n = e.tracks.map((e) => e.id).join(",");
		return `${e.id}:${t}:${n}`;
	}).join("|");
}
//#endregion
export { Ve as TrackSelect, t as generateTrackCatalogJsonSchema, $ as validateJson };

//# sourceMappingURL=genomebrowser-ui-v2.es.js.map