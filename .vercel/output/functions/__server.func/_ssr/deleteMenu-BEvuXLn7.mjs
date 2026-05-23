import { m as prisma } from "./auth-BTxLf562.mjs";
import { R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deleteMenu-BEvuXLn7.js
var deleteMenuInput = object({ id: string().min(1) });
var deleteMenu_createServerFn_handler = createServerRpc({
	id: "608d02bcdcd65fbe639f1bef25247f6c81199cf7e1941bf514c10bb8426b4434",
	name: "deleteMenu",
	filename: "src/features/admin/menu/server/deleteMenu.ts"
}, (opts) => deleteMenu.__executeServer(opts));
var deleteMenu = createServerFn({ method: "POST" }).inputValidator(deleteMenuInput).handler(deleteMenu_createServerFn_handler, async ({ data }) => {
	if (!await prisma.menu.findUnique({ where: { menu_id: data.id } })) throw new Error("Menu item not found.");
	await prisma.menu.delete({ where: { menu_id: data.id } });
	return { success: true };
});
//#endregion
export { deleteMenu_createServerFn_handler };
