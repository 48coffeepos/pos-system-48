import { m as prisma } from "./auth-BTxLf562.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getAllMenu-C4msipDe.js
var getAllMenu_createServerFn_handler = createServerRpc({
	id: "8d40bd0cad94327b898c5fcdd5e83965eafb42b545fb2a8a0f1daa263c780926",
	name: "getAllMenu",
	filename: "src/features/admin/menu/server/getAllMenu.ts"
}, (opts) => getAllMenu.__executeServer(opts));
var getAllMenu = createServerFn({ method: "GET" }).handler(getAllMenu_createServerFn_handler, async () => {
	return (await prisma.menu.findMany({
		orderBy: { name: "asc" },
		include: { inventory_items: { include: { inventory: true } } }
	})).map((menu) => ({
		id: menu.menu_id,
		name: menu.name,
		price: menu.price == null ? null : Number(menu.price),
		type: menu.type,
		menuInventories: [...menu.inventory_items].sort((a, b) => a.inventory.name.localeCompare(b.inventory.name)).map((menuInventory) => ({
			id: menuInventory.menu_inv_id,
			inventoryId: menuInventory.inventory_id,
			inventoryName: menuInventory.inventory.name,
			inventoryType: menuInventory.inventory.type,
			price: Number(menuInventory.price)
		}))
	}));
});
//#endregion
export { getAllMenu_createServerFn_handler };
