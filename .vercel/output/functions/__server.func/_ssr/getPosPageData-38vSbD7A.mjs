import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getPosPageData-38vSbD7A.js
var getPosPageData_createServerFn_handler = createServerRpc({
	id: "f4205540128e93ef1605182971db299c76fb9ba9fbdd849c28a6275c9b62977c",
	name: "getPosPageData",
	filename: "src/features/staff/pos/server/getPosPageData.ts"
}, (opts) => getPosPageData.__executeServer(opts));
var getPosPageData = createServerFn({ method: "GET" }).handler(getPosPageData_createServerFn_handler, async () => {
	const [dbMenuItems, dbAddOns] = await Promise.all([prisma.menu.findMany({
		orderBy: { name: "asc" },
		include: { inventory_items: { include: { inventory: true } } }
	}), prisma.addon.findMany({ orderBy: { name: "asc" } })]);
	return {
		menuItems: dbMenuItems.map((item) => ({
			menu_id: item.menu_id,
			name: item.name,
			price: item.price ? Number(item.price) : null,
			type: item.type,
			inventory_items: item.inventory_items.map((ii) => ({
				price: Number(ii.price),
				inventory: {
					inventory_id: ii.inventory.inventory_id,
					name: ii.inventory.name,
					stock: ii.inventory.stock,
					type: ii.inventory.type
				}
			}))
		})),
		addOns: dbAddOns.map((a) => ({
			addon_id: a.addon_id,
			name: a.name,
			price: Number(a.price)
		}))
	};
});
//#endregion
export { getPosPageData_createServerFn_handler };
