import { m as prisma } from "./auth-BTxLf562.mjs";
import { R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deleteAddOn-BGGFR4ho.js
var deleteAddOnInput = object({ id: string().min(1) });
var deleteAddOn_createServerFn_handler = createServerRpc({
	id: "9659e1e3461853dbce3f5d51a5d70fc847db234867665f88c3ea0d1dad71f9dc",
	name: "deleteAddOn",
	filename: "src/features/admin/menu/server/deleteAddOn.ts"
}, (opts) => deleteAddOn.__executeServer(opts));
var deleteAddOn = createServerFn({ method: "POST" }).inputValidator(deleteAddOnInput).handler(deleteAddOn_createServerFn_handler, async ({ data }) => {
	if (!await prisma.addon.findUnique({ where: { addon_id: data.id } })) throw new Error("Add-on not found.");
	await prisma.addon.delete({ where: { addon_id: data.id } });
	return { success: true };
});
//#endregion
export { deleteAddOn_createServerFn_handler };
