import { c as lazyRouteComponent, l as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { r as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { r as RoutePendingBoundary } from "./route-boundaries-f2dbejVe.mjs";
import { t as xreadingKeys } from "./keys-DoxJBujt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/xreading-93DPXxa1.js
var getDailyReconciliation = createServerFn({ method: "GET" }).handler(createSsrRpc("e26b144a02db5b8cce85be67bc26bd21e190dcdb9b589e8f13392dc2ba0a8381"));
var getDailyReconciliationQueryOptions = () => queryOptions({
	queryKey: xreadingKeys.daily("today"),
	queryFn: () => getDailyReconciliation()
});
var $$splitComponentImporter = () => import("./xreading-CQKtsK_c.mjs");
var $$splitErrorComponentImporter = () => import("./xreading-DCNoX27P.mjs");
var Route = createFileRoute("/staff/xreading")({
	loader: async ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData(getDailyReconciliationQueryOptions());
	},
	pendingComponent: RoutePendingBoundary,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
