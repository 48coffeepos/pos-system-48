import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { prisma } from "@/integrations/prisma/db";

export const createInventoryItemInput = z.object({
  name: z.string().min(1).max(200),
  stock: z.number().int(),
  type: z.enum(["CUP", "STANDALONE"]),
});

export const createInventoryItem = createServerFn({ method: "POST" })
  .inputValidator(createInventoryItemInput)
  .handler(async ({ data }) => {
    const inventoryItem = await prisma.inventory.create({
      data: {
        name: data.name,
        stock: data.stock,
        type: data.type,
      },
    });

    return inventoryItem;
  });
