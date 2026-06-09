import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

export const transferStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const transferStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(transferStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;

    const updated = await prisma.$transaction(async (tx) => {
      const inventory = await applyInventoryMovement(tx, data.itemId, {
        kind: "transfer",
        quantity: data.quantity,
      });

      await tx.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "TRANSFER",
          location: "STOCKROOM",
        },
      });

      await tx.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "TRANSFER",
          location: "STOREFRONT",
        },
      });

      return inventory;
    });

    return mapInventoryItem(updated);
  });
