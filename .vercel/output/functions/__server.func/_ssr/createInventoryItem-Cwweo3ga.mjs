import { m as prisma } from "./auth-BTxLf562.mjs";
import { L as number, R as object, V as string, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createInventoryItem-Cwweo3ga.js
var createInventoryItemInput = object({
	name: string().min(1).max(200),
	stock: number().int(),
	type: _enum(["CUP", "STANDALONE"])
});
var createInventoryItem_createServerFn_handler = createServerRpc({
	id: "0450d0094040195f819a4a428405cebe043e9df8a074b1921c6fbb7b7ac6a038",
	name: "createInventoryItem",
	filename: "src/features/admin/inventory/server/createInventoryItem.ts"
}, (opts) => createInventoryItem.__executeServer(opts));
var createInventoryItem = createServerFn({ method: "POST" }).inputValidator(createInventoryItemInput).handler(createInventoryItem_createServerFn_handler, async ({ data }) => {
	return await prisma.inventory.create({ data: {
		name: data.name,
		stock: data.stock,
		type: data.type
	} });
});
//#endregion
export { createInventoryItem_createServerFn_handler };
