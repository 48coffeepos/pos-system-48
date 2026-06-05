import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const addStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  transactionType: z.enum(["add", "transfer"]),
});

export const addStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(addStockInput)
  .handler(async ({ data }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.itemId },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    if (data.transactionType === "transfer") {
      const currentAdminStock = existing.admin_stock ?? 0;

      // if (data.quantity > currentAdminStock) {
      //   throw new Error("Transfer quantity exceeds available admin stock.");
      // }

      const updated = await prisma.inventory.update({
        where: { inventory_id: data.itemId },
        data: {
          stock: existing.stock + data.quantity,
          admin_stock: currentAdminStock - data.quantity,
        },
      });

      return {
        id: updated.inventory_id,
        name: updated.name,
        stock: updated.stock,
        adminStock: updated.admin_stock ?? 0,
        type: updated.type,
        costPrice: updated.cost_price ? Number(updated.cost_price) : 0,
      };
    }

    const updated = await prisma.inventory.update({
      where: { inventory_id: data.itemId },
      data: {
        admin_stock: (existing.admin_stock ?? 0) + data.quantity,
      },
    });

    return {
      id: updated.inventory_id,
      name: updated.name,
      stock: updated.stock,
      adminStock: updated.admin_stock ?? 0,
      type: updated.type,
      costPrice: updated.cost_price ? Number(updated.cost_price) : 0,
    };
  });
