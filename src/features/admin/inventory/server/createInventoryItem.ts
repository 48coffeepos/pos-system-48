import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const createInventoryItemInput = z.object({
  name: z.string().min(1).max(200),
  stock: z.number().int(),
  type: z.enum(["CUP", "STANDALONE"]),
  costPrice: z.number().min(0).default(0),
});

export const createInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(createInventoryItemInput)
  .handler(async ({ data }) => {
    const inventoryItem = await prisma.inventory.create({
      data: {
        name: data.name,
        stock: data.stock,
        admin_stock: data.stock,
        type: data.type,
        cost_price: data.costPrice,
      },
    });

    return {
      id: inventoryItem.inventory_id,
      name: inventoryItem.name,
      stock: inventoryItem.stock,
      adminStock: inventoryItem.admin_stock ?? 0,
      type: inventoryItem.type,
      costPrice: inventoryItem.cost_price ? Number(inventoryItem.cost_price) : 0,
    };
  });
