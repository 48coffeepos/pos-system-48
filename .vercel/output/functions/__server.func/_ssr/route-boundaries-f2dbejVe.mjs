import { I as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { d as Link, m as ErrorComponent, p as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button$1 } from "./button-B7PjkOIj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-boundaries-f2dbejVe.js
var import_jsx_runtime = require_jsx_runtime();
function RoutePendingBoundary() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "island-shell flex items-center gap-3 rounded-2xl px-5 py-4 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-(--sea-ink-soft)",
				children: "Loading..."
			})]
		})
	});
}
function RouteNotFoundBoundary() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "island-shell max-w-md rounded-2xl p-6 text-center shadow-sm sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "island-kicker mb-2",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mb-3 text-3xl font-bold text-(--sea-ink)",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-6 text-sm leading-6 text-(--sea-ink-soft)",
					children: "The page you're looking for does not exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex items-center justify-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-(--lagoon-deep) no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]",
					children: "Go home"
				})
			]
		})
	});
}
function RouteErrorBoundary({ error, reset }) {
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page-wrap flex min-h-[60vh] items-center justify-center px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "island-shell max-w-xl rounded-2xl p-6 shadow-sm sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "island-kicker mb-2",
					children: "Something broke"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mb-3 text-3xl font-bold text-(--sea-ink)",
					children: "We hit an error"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorComponent, { error }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-6 text-(--sea-ink-soft)",
					children: "Try again to re-run the loader, or return home if the route is no longer valid."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							onClick: () => router.invalidate(),
							children: "Retry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "outline",
							onClick: reset,
							children: "Reset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-(--sea-ink) no-underline transition hover:bg-[rgba(79,184,178,0.12)]",
							children: "Go home"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RouteNotFoundBoundary as n, RoutePendingBoundary as r, RouteErrorBoundary as t };
