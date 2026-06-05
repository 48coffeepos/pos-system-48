import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const stockroomAddStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const stockroomAddStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(stockroomAddStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;

    const item = await prisma.inventory.findUnique({
      where: { inventory_id: data.itemId },
      select: { cost_price: true },
    });

    const unitPrice = item?.cost_price ? Number(item.cost_price) : 0;
    const expense = data.quantity * unitPrice;

    const [updated] = await prisma.$transaction([
      prisma.inventory.update({
        where: { inventory_id: data.itemId },
        data: { admin_stock: { increment: data.quantity } },
      }),
      prisma.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          expense,
          type: "ADD",
          location: "STOCKROOM",
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
