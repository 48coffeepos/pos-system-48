import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middlewares";
import type { Inventory_Type } from "@/generated/prisma/enums.js";
import { prisma } from "@/integrations/prisma/db";

export interface PosPageData {
  menuItems: Array<{
    menu_id: string;
    name: string;
    price: number | null;
    type: Inventory_Type | null;
    inventory_items: Array<{
      price: number;
      inventory: {
        inventory_id: string;
        name: string;
        stock: number;
        type: Inventory_Type;
      };
    }>;
  }>;
  addOns: Array<{
    addon_id: string;
    name: string;
    price: number;
  }>;
}

export const getPosPageData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async (): Promise<PosPageData> => {
    const [dbMenuItems, dbAddOns] = await Promise.all([
      prisma.menu.findMany({
        orderBy: { name: "asc" },
        include: {
          inventory_items: {
            include: {
              inventory: true,
            },
          },
        },
      }),
      prisma.addon.findMany({ orderBy: { name: "asc" } }),
    ]);

    const menuItems = dbMenuItems.map((item) => ({
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
          type: ii.inventory.type,
        },
      })),
    }));

    const addOns = dbAddOns.map((a) => ({
      addon_id: a.addon_id,
      name: a.name,
      price: Number(a.price),
    }));

    return { menuItems, addOns };
  });
