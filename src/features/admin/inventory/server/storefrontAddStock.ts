import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const storefrontAddStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const storefrontAddStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(storefrontAddStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;

    const [updated] = await prisma.$transaction([
      prisma.inventory.update({
        where: { inventory_id: data.itemId },
        data: { stock: { increment: data.quantity } },
      }),
      prisma.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "ADD",
          location: "STOREFRONT",
        },
      }),
    ]);

    return {
      id: updated.inventory_id,
      name: updated.name,
      stock: updated.stock,
      adminStock: updated.admin_stock ?? 0,
      type: updated.type,
      costPrice: updated.cost_price ? Number(updated.cost_price) : 0,
    };
  });
