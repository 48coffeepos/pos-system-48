import { c as auth } from "./auth-BTxLf562.mjs";
import { I as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { E as redirect, c as lazyRouteComponent, l as createFileRoute, n as Scripts, o as createRouter, r as HeadContent, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as c, O as e, f as o$1, o as r, t as o } from "../_libs/phosphor-icons__react.mjs";
import "./tanstack-form-BSMHRPNr.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as sessionQueryOptions } from "./queryOptions-CF7BS3jI.mjs";
import { t as adminAccountsQueryOptions } from "./queryOptions-BztjExpa.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as getExpensesQueryOptions } from "./queryOptions-BPXkmGKa.mjs";
import { n as RouteNotFoundBoundary, r as RoutePendingBoundary, t as RouteErrorBoundary } from "./route-boundaries-f2dbejVe.mjs";
import { t as getAllInventoryQueryOptions } from "./queryOptions-C0OTdcSZ.mjs";
import { n as getAllAddOnsQueryOptions, r as getAllMenuQueryOptions } from "./queryOptions-DcZgUO8i.mjs";
import { t as getAuthRedirectPath } from "./redirectPath-ByWaWr2Z.mjs";
import { t as Route$14 } from "./xreading-93DPXxa1.mjs";
import { t as setupRouterSsrQueryIntegration } from "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import { t as z } from "../_libs/next-themes.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BDGRFksQ.js
var import_jsx_runtime = require_jsx_runtime();
function getContext() {
	return { queryClient: new QueryClient() };
}
var Toaster$1 = ({ ...props }) => {
	const { theme = "system" } = z();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme,
		className: "toaster group",
		icons: {
			success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { className: "size-4" }),
			info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "size-4" }),
			warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, { className: "size-4" }),
			error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, { className: "size-4" }),
			loading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, { className: "size-4 animate-spin" })
		},
		style: {
			"--normal-bg": "var(--popover)",
			"--normal-text": "var(--popover-foreground)",
			"--normal-border": "var(--border)",
			"--border-radius": "var(--radius)"
		},
		toastOptions: { classNames: { toast: "cn-toast" } },
		...props
	});
};
var siteName = "48 Coffee Management";
var siteDescription = "Run your coffee shop with a clean, type-safe TanStack Start dashboard.";
function createSeo({ title, description = siteDescription } = {}) {
	return { meta: [
		{ title: title ? `${title} | ${siteName}` : siteName },
		{
			name: "description",
			content: description
		},
		{
			property: "og:site_name",
			content: siteName
		},
		{
			property: "og:title",
			content: title ? `${title} | ${siteName}` : siteName
		},
		{
			property: "og:description",
			content: description
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: title ? `${title} | ${siteName}` : siteName
		},
		{
			name: "twitter:description",
			content: description
		}
	] };
}
var styles_default = "/assets/styles-BtV_L9fX.css";
var Route$13 = createRootRouteWithContext()({
	errorComponent: RouteErrorBoundary,
	notFoundComponent: RouteNotFoundBoundary,
	pendingComponent: RoutePendingBoundary,
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			...createSeo({
				title: "48 Coffee POS",
				description: "POS for 48 Coffee - Ledesma"
			}).meta
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]",
			children: [
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
					position: "top-right",
					richColors: true,
					duration: 3e3,
					closeButton: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./route-C6RtdZla.mjs");
var Route$12 = createFileRoute("/staff")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	loader: async ({ context }) => {
		if (!await context.queryClient.ensureQueryData(sessionQueryOptions)) throw redirect({ to: "/" });
	}
});
var $$splitComponentImporter$10 = () => import("./route-KEeXTOvL.mjs");
var Route$11 = createFileRoute("/admin")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	loader: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(sessionQueryOptions);
		if (!session?.user) throw redirect({ to: "/" });
		if (session.user.role !== "admin") throw redirect({ to: "/staff/pos" });
	}
});
var $$splitComponentImporter$9 = () => import("./routes-D6FgEMPT.mjs");
var Route$10 = createFileRoute("/")({
	loader: async ({ context }) => {
		const session = await context.queryClient.fetchQuery(sessionQueryOptions);
		if (session?.user) throw redirect({ to: getAuthRedirectPath(session.user.role) });
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./staff-DKnRiLIm.mjs");
var Route$9 = createFileRoute("/staff/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin-l2ua7UXY.mjs");
var Route$8 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./pos-DHoygFPs.mjs");
var Route$7 = createFileRoute("/staff/pos")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./orders-DBQmI5Eb.mjs");
var Route$6 = createFileRoute("/staff/orders")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./inventory-DkjvXAlT.mjs");
var Route$5 = createFileRoute("/staff/inventory")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getAllInventoryQueryOptions);
	},
	pendingComponent: RoutePendingBoundary,
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./expenses-57G_U1ya.mjs");
var Route$4 = createFileRoute("/staff/expenses")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getExpensesQueryOptions("today"));
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./menu-yDTs-ZHC.mjs");
var $$splitErrorComponentImporter$1 = () => import("./menu-CysG2My3.mjs");
var Route$3 = createFileRoute("/admin/menu")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getAllMenuQueryOptions);
		await queryClient.ensureQueryData(getAllAddOnsQueryOptions);
		await queryClient.ensureQueryData(getAllInventoryQueryOptions);
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./inventory-DfJTX1W0.mjs");
var $$splitErrorComponentImporter = () => import("./inventory-CPeeqaDG.mjs");
var Route$2 = createFileRoute("/admin/inventory")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getAllInventoryQueryOptions);
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./accounts-CuAMEIFQ.mjs");
var Route$1 = createFileRoute("/admin/accounts")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(adminAccountsQueryOptions);
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: async ({ request }) => {
		return await auth.handler(request);
	},
	POST: async ({ request }) => {
		return await auth.handler(request);
	}
} } });
var StaffRouteRoute = Route$12.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => Route$13
});
var AdminRouteRoute = Route$11.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$13
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var StaffIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => StaffRouteRoute
});
var AdminIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRouteRoute
});
var StaffXreadingRoute = Route$14.update({
	id: "/xreading",
	path: "/xreading",
	getParentRoute: () => StaffRouteRoute
});
var StaffPosRoute = Route$7.update({
	id: "/pos",
	path: "/pos",
	getParentRoute: () => StaffRouteRoute
});
var StaffOrdersRoute = Route$6.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => StaffRouteRoute
});
var StaffInventoryRoute = Route$5.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => StaffRouteRoute
});
var StaffExpensesRoute = Route$4.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => StaffRouteRoute
});
var AdminMenuRoute = Route$3.update({
	id: "/menu",
	path: "/menu",
	getParentRoute: () => AdminRouteRoute
});
var AdminInventoryRoute = Route$2.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRouteRoute
});
var AdminAccountsRoute = Route$1.update({
	id: "/accounts",
	path: "/accounts",
	getParentRoute: () => AdminRouteRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$13
});
var AdminRouteRouteChildren = {
	AdminAccountsRoute,
	AdminInventoryRoute,
	AdminMenuRoute,
	AdminIndexRoute
};
var AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(AdminRouteRouteChildren);
var StaffRouteRouteChildren = {
	StaffExpensesRoute,
	StaffInventoryRoute,
	StaffOrdersRoute,
	StaffPosRoute,
	StaffXreadingRoute,
	StaffIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRouteWithChildren,
	StaffRouteRoute: StaffRouteRoute._addFileChildren(StaffRouteRouteChildren),
	ApiAuthSplatRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	const context = getContext();
	const router = createRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0
	});
	setupRouterSsrQueryIntegration({
		router,
		queryClient: context.queryClient
	});
	return router;
}
//#endregion
export { getRouter };
