import { o as __toESM } from "../_runtime.mjs";
import { L as number, R as object, V as string, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { C as o$1, S as e, T as o, i as e$1, u as r } from "../_libs/phosphor-icons__react.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { n as useMutation, t as mutationOptions } from "../_libs/tanstack__react-query.mjs";
import { a as AlertDialogDescription, c as AlertDialogMedia, i as AlertDialogContent, l as AlertDialogTitle, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as inventoryKeys } from "./keys-B5wYk-Lf.mjs";
import { t as Fuse } from "../_libs/fuse.js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/InventoryList-DnjBzYzr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var addStockInput = object({
	itemId: string(),
	quantity: number().int().min(1)
});
var addStock = createServerFn({ method: "POST" }).inputValidator(addStockInput).handler(createSsrRpc("f32ad6ff9949d06ad3b7c019badd6626f36983247ac1ec2cdc84518501451575"));
var createInventoryItemInput = object({
	name: string().min(1).max(200),
	stock: number().int(),
	type: _enum(["CUP", "STANDALONE"])
});
var createInventoryItem = createServerFn({ method: "POST" }).inputValidator(createInventoryItemInput).handler(createSsrRpc("0450d0094040195f819a4a428405cebe043e9df8a074b1921c6fbb7b7ac6a038"));
var deleteInventoryItemInput = object({ id: string() });
var deleteInventoryItem = createServerFn({ method: "POST" }).inputValidator(deleteInventoryItemInput).handler(createSsrRpc("83dff37ff3ea2b43e9cc75118d5fb1cad22d42e4e0dad3f5def72ba3acf81c50"));
var updateInventoryItemInput = object({
	id: string(),
	name: string().min(1).max(200),
	stock: number().int().min(0),
	type: _enum(["CUP", "STANDALONE"])
});
var updateInventoryItem = createServerFn({ method: "POST" }).inputValidator(updateInventoryItemInput).handler(createSsrRpc("470d78c7002c16aa5dbb09e76df3a71491303e2d4847e29c0b3e58e362347336"));
var createInventoryItemMutationOptions = mutationOptions({
	mutationFn: async (data) => createInventoryItem({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({ queryKey: inventoryKeys.inventory });
		toast.success("Item created", { description: `${variables.name} has been added to inventory.` });
	},
	onError: (error) => {
		toast.error("Failed to create item", { description: error?.message ?? "Unknown error" });
	}
});
var addStockMutationOptions = mutationOptions({
	mutationFn: async (data) => addStock({ data }),
	onSuccess: (data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({ queryKey: inventoryKeys.inventory });
		toast.success("Stock updated", { description: `Added ${variables.quantity} to ${data.name}.` });
	},
	onError: (error) => {
		toast.error("Failed to update stock", { description: error?.message ?? "Unknown error" });
	}
});
var updateInventoryItemMutationOptions = mutationOptions({
	mutationFn: async (data) => updateInventoryItem({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({ queryKey: inventoryKeys.inventory });
		toast.success("Item updated", { description: `${variables.name} has been saved.` });
	},
	onError: (error) => {
		toast.error("Failed to update item", { description: error?.message ?? "Unknown error" });
	}
});
var deleteInventoryItemMutationOptions = mutationOptions({
	mutationFn: async (data) => deleteInventoryItem({ data }),
	onSuccess: (_data, _variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({ queryKey: inventoryKeys.inventory });
		toast.success("Item deleted");
	},
	onError: (error) => {
		toast.error("Failed to delete item", { description: error?.message ?? "Unknown error" });
	}
});
function InventoryList({ items = [], onEdit, hideActions = false }) {
	const [timeframe, setTimeframe] = (0, import_react.useState)("today");
	const [search, setSearch] = (0, import_react.useState)("");
	const [deletingItem, setDeletingItem] = (0, import_react.useState)(null);
	const fuse = (0, import_react.useMemo)(() => new Fuse(items, {
		keys: ["name"],
		threshold: .3
	}), [items]);
	const filtered = (0, import_react.useMemo)(() => search ? fuse.search(search).map((r) => r.item) : items, [
		search,
		fuse,
		items
	]);
	const deleteMutation = useMutation({
		...deleteInventoryItemMutationOptions,
		onSettled: () => {
			setDeletingItem(null);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "mx-auto size-12 text-(--medium-gray)/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-4 text-lg font-semibold text-(--deep-forest)",
			children: "No inventory items yet"
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-(--deep-forest)",
					children: "Inventory items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-(--medium-gray) mt-0.5",
					children: "Track item quantity and category"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTimeframe("today"),
						className: `rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${timeframe === "today" ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--medium-gray) hover:bg-(--light-gray)/50"}`,
						children: "Today"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTimeframe("yesterday"),
						className: `rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${timeframe === "yesterday" ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--medium-gray) hover:bg-(--light-gray)/50"}`,
						children: "Yesterday"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
					className: "absolute top-1/2 left-4 size-4 -translate-y-1/2",
					style: { color: "var(--medium-gray)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search inventory items...",
					className: "h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all",
					style: {
						background: "white",
						borderColor: "var(--light-gray)"
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full border-collapse text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-(--light-gray)/40 bg-(--soft-peach)/20 text-[11px] font-bold tracking-wider text-(--medium-gray)/80 uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "rounded-l-lg p-3 pl-4",
								children: "Item"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-center",
								children: "Quantity"
							}),
							!hideActions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "rounded-r-lg p-3 pr-4 text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-(--light-gray)/40",
						children: filtered.length > 0 ? filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "group hover:bg-(--light-gray)/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 pl-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-sm text-(--deep-forest)",
											children: item.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mt-0.5 bg-amber-100 text-amber-800",
											children: item.type === "CUP" ? "Cup Size" : "Standalone"
										})] })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-center font-bold text-sm text-(--deep-forest)",
									children: timeframe === "today" ? item.stock : item.yesterdayStock ?? 0
								}),
								!hideActions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 pr-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-3 text-(--medium-gray)",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => onEdit?.(item),
											className: "p-1 hover:text-(--deep-forest) transition-colors",
											"aria-label": "Edit item",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, { size: 18 })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setDeletingItem(item),
											className: "p-1 hover:text-red-600 transition-colors",
											"aria-label": "Delete item record",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, { size: 18 })
										})]
									})
								})
							]
						}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: hideActions ? 2 : 3,
							className: "h-24 text-center text-sm text-(--medium-gray)",
							children: "No items match your search."
						}) })
					})]
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open: !!deletingItem,
		onOpenChange: (open) => {
			if (!open) setDeletingItem(null);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			size: "sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogMedia, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, {
					weight: "fill",
					className: "size-8 text-red-500"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete item?" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"This will permanently remove ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingItem?.name }),
					" ",
					"from inventory. This action cannot be undone."
				] })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				variant: "destructive",
				disabled: deleteMutation.isPending,
				onClick: () => {
					if (deletingItem) deleteMutation.mutate({ id: deletingItem.id });
				},
				children: deleteMutation.isPending ? "Deleting..." : "Delete"
			})] })]
		})
	})] });
}
//#endregion
export { updateInventoryItemMutationOptions as i, addStockMutationOptions as n, createInventoryItemMutationOptions as r, InventoryList as t };
