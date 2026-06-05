import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const getAllInventory = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => {
  const items = await prisma.inventory.findMany({
    orderBy: { name: "asc" },
  });

  return items.map((item) => ({
    id: item.inventory_id,
    name: item.name,
    yesterdayStock: item.yesterday_stock ?? 0,
    stock: item.stock,
    adminStock: item.admin_stock ?? 0,
    type: item.type,
    costPrice: item.cost_price ? Number(item.cost_price) : 0,
  }));
});
