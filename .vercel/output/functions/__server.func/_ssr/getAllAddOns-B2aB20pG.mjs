import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getAllAddOns-B2aB20pG.js
var getAllAddOns_createServerFn_handler = createServerRpc({
	id: "07575acbeee91e5303945443543b5eacddde89d2fd4f69e3fc69eb63b76dd84a",
	name: "getAllAddOns",
	filename: "src/features/admin/menu/server/getAllAddOns.ts"
}, (opts) => getAllAddOns.__executeServer(opts));
var getAllAddOns = createServerFn({ method: "GET" }).handler(getAllAddOns_createServerFn_handler, async () => {
	return (await prisma.addon.findMany({ orderBy: { name: "asc" } })).map((a) => ({
		id: a.addon_id,
		name: a.name,
		amount: Number(a.price)
	}));
});
//#endregion
export { getAllAddOns_createServerFn_handler };
