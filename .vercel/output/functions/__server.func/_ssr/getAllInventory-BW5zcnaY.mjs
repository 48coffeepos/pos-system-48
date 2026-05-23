import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getAllInventory-BW5zcnaY.js
var getAllInventory_createServerFn_handler = createServerRpc({
	id: "7ca22818cd6abfa4c82bda02a23936d02a046db8439590200ff6414463eec631",
	name: "getAllInventory",
	filename: "src/features/admin/inventory/server/getAllInventory.ts"
}, (opts) => getAllInventory.__executeServer(opts));
var getAllInventory = createServerFn({ method: "GET" }).handler(getAllInventory_createServerFn_handler, async () => {
	return (await prisma.inventory.findMany({ orderBy: { name: "asc" } })).map((item) => ({
		id: item.inventory_id,
		name: item.name,
		yesterdayStock: item.yesterday_stock ?? 0,
		stock: item.stock,
		type: item.type
	}));
});
//#endregion
export { getAllInventory_createServerFn_handler };
