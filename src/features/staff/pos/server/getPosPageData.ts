import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";

export interface PosPageData {
  categories: string[];
  menuItems: Array<{
    id: number;
    name: string;
    price: number;
    category: string;
    temperatures: string[];
    hot_cup_sizes: number[];
    iced_cup_sizes: number[];
    hot_12oz_price: number;
    iced_12oz_price: number;
    iced_16oz_price: number;
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
      prisma.menu.findMany({ orderBy: { id: "asc" } }),
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
      temperatures: item.temperatures,
      hot_cup_sizes: item.hot_cup_sizes,
      iced_cup_sizes: item.iced_cup_sizes,
      hot_12oz_price: item.hot_12oz_price,
      iced_12oz_price: item.iced_12oz_price,
      iced_16oz_price: item.iced_16oz_price,
    }));

    const addOns = dbAddOns.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
    }));

    return { categories, menuItems, addOns };
  },
);
