import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

export const stockroomAddStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  itemName: z.string(),
});

export const stockroomAddStock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(stockroomAddStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;
    const expense = data.quantity * data.unitPrice;

    const updated = await prisma.$transaction(async (tx) => {
      await tx.inventory.update({
        where: { inventory_id: data.itemId },
        data: { cost_price: data.unitPrice },
      });

      const inventory = await applyInventoryMovement(tx, data.itemId, {
        kind: "admin_in",
        quantity: data.quantity,
      });

      await tx.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          expense,
          type: "ADD",
          location: "STOCKROOM",
        },
      });

      return inventory;
    });

    return mapInventoryItem(updated);
  });
