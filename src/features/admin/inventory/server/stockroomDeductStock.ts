import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

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

    const updated = await prisma.$transaction(async (tx) => {
      const inventory = await applyInventoryMovement(tx, data.itemId, {
        kind: "admin_out",
        quantity: data.quantity,
      });

      await tx.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "DEDUCT",
          location: "STOCKROOM",
        },
      });

      return inventory;
    });

    return mapInventoryItem(updated);
  });
