import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { r as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as inventoryKeys } from "./keys-B5wYk-Lf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queryOptions-C0OTdcSZ.js
var getAllInventory = createServerFn({ method: "GET" }).handler(createSsrRpc("7ca22818cd6abfa4c82bda02a23936d02a046db8439590200ff6414463eec631"));
var getAllInventoryQueryOptions = queryOptions({
	queryKey: inventoryKeys.inventory,
	queryFn: getAllInventory
});
//#endregion
export { getAllInventoryQueryOptions as t };
