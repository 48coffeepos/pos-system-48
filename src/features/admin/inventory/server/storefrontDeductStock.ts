import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

export const storefrontDeductStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const storefrontDeductStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(storefrontDeductStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;

    const updated = await prisma.$transaction(async (tx) => {
      const inventory = await applyInventoryMovement(tx, data.itemId, {
        kind: "store_out",
        quantity: data.quantity,
      });

      await tx.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "DEDUCT",
          location: "STOREFRONT",
        },
      });

      return inventory;
    });

    return mapInventoryItem(updated);
  });
