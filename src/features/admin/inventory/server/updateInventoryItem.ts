import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { prisma } from "@/integrations/prisma/db";

export const updateInventoryItemInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  stock: z.number().int().min(0),
  type: z.enum(["CUP", "STANDALONE"]),
});

export const updateInventoryItem = createServerFn({ method: "POST" })
  .inputValidator(updateInventoryItemInput)
  .handler(async ({ data }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.id },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    const updated = await prisma.inventory.update({
      where: { inventory_id: data.id },
      data: {
        name: data.name,
        stock: data.stock,
        type: data.type,
      },
    });

    return {
      id: updated.inventory_id,
      name: updated.name,
      stock: updated.stock,
      type: updated.type,
    };
  });
