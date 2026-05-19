import { createServerFn } from "@tanstack/react-start";

import { prisma } from "@/integrations/prisma/db";

export const getAllInventory = createServerFn({ method: "GET" }).handler(async () => {
  const items = await prisma.inventory.findMany({
    orderBy: { name: "asc" },
  });

  return items.map((item) => ({
    id: item.inventory_id,
    name: item.name,
    yesterdayStock: item.yesterday_stock ?? 0,
    stock: item.stock,
    type: item.type,
  }));
});
