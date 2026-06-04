import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const stockroomAddStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
  unitPrice: z.number().min(0),
});

export const stockroomAddStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(stockroomAddStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;
    const expense = data.quantity * data.unitPrice;

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

    return updated;
  });
