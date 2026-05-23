import { m as prisma } from "./auth-BTxLf562.mjs";
import { L as number, R as object, V as string, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/updateInventoryItem-DxOvbmNn.js
var updateInventoryItemInput = object({
	id: string(),
	name: string().min(1).max(200),
	stock: number().int().min(0),
	type: _enum(["CUP", "STANDALONE"])
});
var updateInventoryItem_createServerFn_handler = createServerRpc({
	id: "470d78c7002c16aa5dbb09e76df3a71491303e2d4847e29c0b3e58e362347336",
	name: "updateInventoryItem",
	filename: "src/features/admin/inventory/server/updateInventoryItem.ts"
}, (opts) => updateInventoryItem.__executeServer(opts));
var updateInventoryItem = createServerFn({ method: "POST" }).inputValidator(updateInventoryItemInput).handler(updateInventoryItem_createServerFn_handler, async ({ data }) => {
	if (!await prisma.inventory.findUnique({ where: { inventory_id: data.id } })) throw new Error("Inventory item not found.");
	const updated = await prisma.inventory.update({
		where: { inventory_id: data.id },
		data: {
			name: data.name,
			stock: data.stock,
			type: data.type
		}
	});
	return {
		id: updated.inventory_id,
		name: updated.name,
		stock: updated.stock,
		type: updated.type
	};
});
//#endregion
export { updateInventoryItem_createServerFn_handler };
