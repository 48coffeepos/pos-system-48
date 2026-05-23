import { f as Inventory_Type, m as prisma } from "./auth-BTxLf562.mjs";
import { B as record, F as literal, H as union, L as number, M as boolean, R as object, V as string, j as array, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-Cc--TFGz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saveMenu-C9Lg49uD.js
var saveMenuInput = object({
	mode: union([literal("create"), literal("edit")]),
	menuId: string().optional(),
	name: string().trim().min(1).max(200),
	trackInventory: boolean(),
	price: number().positive().optional(),
	itemType: _enum([Inventory_Type.CUP, Inventory_Type.STANDALONE]).optional(),
	selectedCupIds: array(string()),
	cupPrices: record(string(), number()),
	standaloneMode: union([literal("existing"), literal("new")]).optional(),
	selectedInventoryId: string().optional(),
	newInventoryName: string().optional(),
	standalonePrice: number().positive().optional()
});
function normalizeMenuError(error) {
	if (error instanceof Error) {
		if (error.message.includes("Unique constraint failed")) return /* @__PURE__ */ new Error("A menu item with this name already exists.");
		return error;
	}
	return /* @__PURE__ */ new Error("Failed to save menu item.");
}
var saveMenu_createServerFn_handler = createServerRpc({
	id: "2087b2fb5354eb181d021295ccf683eb151f4f1485ffe0882cb4d86f97894c7b",
	name: "saveMenu",
	filename: "src/features/admin/menu/server/saveMenu.ts"
}, (opts) => saveMenu.__executeServer(opts));
var saveMenu = createServerFn({ method: "POST" }).inputValidator(saveMenuInput).handler(saveMenu_createServerFn_handler, async ({ data }) => {
	try {
		const menuId = data.menuId ?? void 0;
		const menu = await prisma.$transaction(async (tx) => {
			const existingMenu = menuId == null ? null : await tx.menu.findUnique({
				where: { menu_id: menuId },
				include: { inventory_items: true }
			});
			if (menuId != null && !existingMenu) throw new Error("Menu item not found.");
			if (data.trackInventory && !data.itemType) throw new Error("Item type is required when tracking inventory.");
			const menuType = data.trackInventory ? data.itemType : null;
			let resolvedMenuId = menuId;
			if (resolvedMenuId == null) resolvedMenuId = (await tx.menu.create({ data: {
				name: data.name,
				price: data.trackInventory ? null : data.price ?? null,
				type: menuType
			} })).menu_id;
			else await tx.menu.update({
				where: { menu_id: resolvedMenuId },
				data: {
					name: data.name,
					price: data.trackInventory ? null : data.price ?? null,
					type: menuType
				}
			});
			await tx.menuInventory.deleteMany({ where: { menu_id: resolvedMenuId } });
			if (!data.trackInventory) return tx.menu.findUnique({
				where: { menu_id: resolvedMenuId },
				include: { inventory_items: { include: { inventory: true } } }
			});
			if (data.itemType === Inventory_Type.CUP) {
				const cupLinks = data.selectedCupIds.map((cupId) => ({
					cupId,
					price: data.cupPrices[cupId]
				})).filter((entry) => typeof entry.price === "number" && entry.price > 0);
				if (cupLinks.length === 0) throw new Error("Select at least one cup size.");
				await tx.menuInventory.createMany({ data: cupLinks.map((entry) => ({
					menu_id: resolvedMenuId,
					inventory_id: entry.cupId,
					price: entry.price
				})) });
			}
			if (data.itemType === Inventory_Type.STANDALONE) {
				const standalonePrice = data.standalonePrice;
				if (standalonePrice == null || standalonePrice <= 0) throw new Error("Standalone price is required.");
				if (data.standaloneMode === "existing") {
					if (!data.selectedInventoryId) throw new Error("Select an inventory item.");
					await tx.menuInventory.create({ data: {
						menu_id: resolvedMenuId,
						inventory_id: data.selectedInventoryId,
						price: standalonePrice
					} });
				}
				if (data.standaloneMode === "new") {
					const inventoryName = data.newInventoryName?.trim();
					if (!inventoryName) throw new Error("Inventory name is required.");
					const createdInventory = await tx.inventory.create({ data: {
						name: inventoryName,
						stock: 0,
						type: Inventory_Type.STANDALONE
					} });
					await tx.menuInventory.create({ data: {
						menu_id: resolvedMenuId,
						inventory_id: createdInventory.inventory_id,
						price: standalonePrice
					} });
				}
			}
			return tx.menu.findUnique({
				where: { menu_id: resolvedMenuId },
				include: { inventory_items: { include: { inventory: true } } }
			});
		});
		if (!menu) throw new Error("Menu item was not saved.");
		return {
			id: menu.menu_id,
			name: menu.name,
			price: menu.price == null ? null : Number(menu.price),
			type: menu.type,
			inventory_items: menu.inventory_items.map((menuInventory) => ({
				id: menuInventory.menu_inv_id,
				inventoryId: menuInventory.inventory_id,
				inventoryName: menuInventory.inventory.name,
				inventoryType: menuInventory.inventory.type,
				price: Number(menuInventory.price)
			}))
		};
	} catch (error) {
		throw normalizeMenuError(error);
	}
});
//#endregion
export { saveMenu_createServerFn_handler };
