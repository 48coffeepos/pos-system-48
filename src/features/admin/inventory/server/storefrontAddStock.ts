import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

export const storefrontAddStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const storefrontAddStock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(storefrontAddStockInput)
  .handler(async ({ data, context }) => {
    const logBy = context.session.user.name;

    const updated = await prisma.$transaction(async (tx) => {
      const inventory = await applyInventoryMovement(tx, data.itemId, {
        kind: "store_in",
        quantity: data.quantity,
      });

      await tx.inventoryLog.create({
        data: {
          inventory_item: data.itemName,
          log_by: logBy,
          quantity: data.quantity,
          type: "ADD",
          location: "STOREFRONT",
        },
      });

      return inventory;
    });

    return mapInventoryItem(updated);
  });
