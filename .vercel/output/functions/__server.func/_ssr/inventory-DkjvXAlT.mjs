import { I as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { t as Button$1 } from "./button-B7PjkOIj.mjs";
import { i as e } from "../_libs/phosphor-icons__react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as getAllInventoryQueryOptions } from "./queryOptions-C0OTdcSZ.mjs";
import { t as InventoryList } from "./InventoryList-DnjBzYzr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DkjvXAlT.js
var import_jsx_runtime = require_jsx_runtime();
function StaffInventory() {
	const { data: inventoryItems, isLoading, isError, error, refetch } = useQuery(getAllInventoryQueryOptions);
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center gap-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
							weight: "fill",
							className: "size-10 text-(--error)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold text-(--deep-forest)",
							children: "Failed to load inventory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-(--medium-gray)",
							children: error?.message ?? "Something went wrong"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							onClick: () => refetch(),
							variant: "outline",
							size: "sm",
							children: "Retry"
						})
					]
				})
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		style: { background: "var(--warm-beige)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryList, {
				items: inventoryItems ?? [],
				hideActions: true
			})
		})
	});
}
//#endregion
export { StaffInventory as component };
