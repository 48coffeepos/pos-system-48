import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { prisma } from "@/integrations/prisma/db";

export const addStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
});

export const addStock = createServerFn({ method: "POST" })
  .inputValidator(addStockInput)
  .handler(async ({ data }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.itemId },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    const updated = await prisma.inventory.update({
      where: { inventory_id: data.itemId },
      data: { stock: existing.stock + data.quantity },
    });

    return updated;
  });
