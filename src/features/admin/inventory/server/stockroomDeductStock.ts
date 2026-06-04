import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const stockroomDeductStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const stockroomDeductStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(stockroomDeductStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;

    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.itemId },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    if ((existing.admin_stock ?? 0) < data.quantity) {
      throw new Error(
        `Cannot deduct ${data.quantity} — only ${existing.admin_stock ?? 0} available in stockroom.`
      );
    }

    const [updated] = await prisma.$transaction([
      prisma.inventory.update({
        where: { inventory_id: data.itemId },
        data: { admin_stock: { decrement: data.quantity } },
      }),
      prisma.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "DEDUCT",
          location: "STOCKROOM",
        },
      }),
    ]);

    return updated;
  });
