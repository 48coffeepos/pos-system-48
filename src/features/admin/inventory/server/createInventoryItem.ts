import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { mapInventoryItem } from "./mapInventoryItem";

export const createInventoryItemInput = z.object({
  name: z.string().min(1).max(200),
  stock: z.number().int(),
  type: z.enum(["CUP", "STANDALONE", "SUPPLIES"]),
  costPrice: z.number().min(0).default(0),
});

export const createInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(createInventoryItemInput)
  .handler(async ({ data }) => {
    const inventoryItem = await prisma.inventory.create({
      data: {
        name: data.name,
        type: data.type,
        cost_price: data.costPrice,
        in_admin: data.stock,
        ending_admin: data.stock,
        in_store: data.stock,
        ending_store: data.stock,
      },
    });

    return mapInventoryItem(inventoryItem);
  });
