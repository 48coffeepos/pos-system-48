import { m as prisma } from "./auth-BTxLf562.mjs";
import { L as number, R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/addStock-CSF2TkL1.js
var addStockInput = object({
	itemId: string(),
	quantity: number().int().min(1)
});
var addStock_createServerFn_handler = createServerRpc({
	id: "f32ad6ff9949d06ad3b7c019badd6626f36983247ac1ec2cdc84518501451575",
	name: "addStock",
	filename: "src/features/admin/inventory/server/addStock.ts"
}, (opts) => addStock.__executeServer(opts));
var addStock = createServerFn({ method: "POST" }).inputValidator(addStockInput).handler(addStock_createServerFn_handler, async ({ data }) => {
	const existing = await prisma.inventory.findUnique({ where: { inventory_id: data.itemId } });
	if (!existing) throw new Error("Inventory item not found.");
	return await prisma.inventory.update({
		where: { inventory_id: data.itemId },
		data: { stock: existing.stock + data.quantity }
	});
});
//#endregion
export { addStock_createServerFn_handler };
