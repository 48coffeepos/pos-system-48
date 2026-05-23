import { m as prisma } from "./auth-BTxLf562.mjs";
import { R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deleteInventoryItem-BynoITYV.js
var deleteInventoryItemInput = object({ id: string() });
var deleteInventoryItem_createServerFn_handler = createServerRpc({
	id: "83dff37ff3ea2b43e9cc75118d5fb1cad22d42e4e0dad3f5def72ba3acf81c50",
	name: "deleteInventoryItem",
	filename: "src/features/admin/inventory/server/deleteInventoryItem.ts"
}, (opts) => deleteInventoryItem.__executeServer(opts));
var deleteInventoryItem = createServerFn({ method: "POST" }).inputValidator(deleteInventoryItemInput).handler(deleteInventoryItem_createServerFn_handler, async ({ data }) => {
	if (!await prisma.inventory.findUnique({ where: { inventory_id: data.id } })) throw new Error("Inventory item not found.");
	await prisma.inventory.delete({ where: { inventory_id: data.id } });
	return { success: true };
});
//#endregion
export { deleteInventoryItem_createServerFn_handler };
