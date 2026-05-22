import { createServerFn } from "@tanstack/react-start";

import { prisma } from "@/integrations/prisma/db";

export const getAllMenu = createServerFn({ method: "GET" }).handler(
	async () => {
		const menus = await prisma.menu.findMany({
			orderBy: { name: "asc" },
			include: {
				inventory_items: {
					include: {
						inventory: true,
					},
				},
			},
		});

		return menus.map((menu) => ({
			id: menu.menu_id,
			name: menu.name,
			price: menu.price == null ? null : Number(menu.price),
			type: menu.type,
			menuInventories: [...menu.inventory_items]
				.sort((a, b) => a.inventory.name.localeCompare(b.inventory.name))
				.map((menuInventory) => ({
					id: menuInventory.menu_inv_id,
					inventoryId: menuInventory.inventory_id,
					inventoryName: menuInventory.inventory.name,
					inventoryType: menuInventory.inventory.type,
					price: Number(menuInventory.price),
				})),
		}));
	},
);
