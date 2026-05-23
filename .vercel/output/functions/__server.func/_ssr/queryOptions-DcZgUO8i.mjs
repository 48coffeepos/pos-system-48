import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { r as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queryOptions-DcZgUO8i.js
var menuKeys = { all: ["menu"] };
var addonKeys = { all: ["addons"] };
var getAllMenu = createServerFn({ method: "GET" }).handler(createSsrRpc("8d40bd0cad94327b898c5fcdd5e83965eafb42b545fb2a8a0f1daa263c780926"));
var getAllAddOns = createServerFn({ method: "GET" }).handler(createSsrRpc("07575acbeee91e5303945443543b5eacddde89d2fd4f69e3fc69eb63b76dd84a"));
var getAllMenuQueryOptions = queryOptions({
	queryKey: menuKeys.all,
	queryFn: getAllMenu
});
var getAllAddOnsQueryOptions = queryOptions({
	queryKey: addonKeys.all,
	queryFn: getAllAddOns
});
//#endregion
export { menuKeys as i, getAllAddOnsQueryOptions as n, getAllMenuQueryOptions as r, addonKeys as t };
