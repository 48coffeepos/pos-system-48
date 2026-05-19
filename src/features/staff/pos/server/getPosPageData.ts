import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";
import { Inventory_Type } from "@/generated/prisma/enums.js";

export interface PosPageData {
  categories: string[];
  menuItems: Array<{
    id: number;
    name: string;
    price: number;
    category: string;
    type: Inventory_Type;
    inventory_items: Array<{
      inventory: {
        inventory_id: string;
        name: string;
        stock: number;
        type: Inventory_Type;
      };
    }>;
  }>;
  addOns: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export const getPosPageData = createServerFn({ method: "GET" }).handler(
  async (): Promise<PosPageData> => {
    const [dbMenuItems, dbAddOns] = await Promise.all([
      prisma.menu.findMany({
        orderBy: { id: "asc" },
        include: {
          inventory_items: {
            include: {
              inventory: true,
            },
          },
        },
      }),
      prisma.addon.findMany({ orderBy: { id: "asc" } }),
    ]);

    const categoryRows = await prisma.menu.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });

    const categories = categoryRows
      .map((r) => r.category)
      .sort((a, b) => {
        if (a === "extra") return 1;
        if (b === "extra") return -1;
        return a.localeCompare(b);
      });

    const menuItems = dbMenuItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      type: item.type,
      inventory_items: item.inventory_items.map((ii) => ({
        price: ii.price,
        inventory: {
          inventory_id: ii.inventory.inventory_id,
          name: ii.inventory.name,
          stock: ii.inventory.stock,
          type: ii.inventory.type,
        },
      })),
    }));

    const addOns = dbAddOns.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
    }));

    return { categories, menuItems, addOns };
  },
);
