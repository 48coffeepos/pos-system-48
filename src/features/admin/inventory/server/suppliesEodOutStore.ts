import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

export const suppliesEodOutStoreInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  itemName: z.string(),
});

export const suppliesEodOutStore = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(suppliesEodOutStoreInput)
  .handler(async ({ data, context }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.itemId },
      select: { type: true },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    if (existing.type !== "SUPPLIES") {
      throw new Error(
        "End-of-day usage can only be recorded for SUPPLIES items.",
      );
    }

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
