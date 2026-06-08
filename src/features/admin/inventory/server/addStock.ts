import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { applyInventoryMovement } from "./inventoryMovement";
import { mapInventoryItem } from "./mapInventoryItem";

export const addStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  transactionType: z.enum(["add", "transfer"]),
});

export const addStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(addStockInput)
  .handler(async ({ data }) => {
    const updated = await prisma.$transaction(async (tx) => {
      const movement =
        data.transactionType === "transfer"
          ? ({ kind: "transfer", quantity: data.quantity } as const)
          : ({ kind: "admin_in", quantity: data.quantity } as const);

      return applyInventoryMovement(tx, data.itemId, movement);
    });

    return mapInventoryItem(updated);
  });
