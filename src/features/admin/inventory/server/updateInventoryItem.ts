import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { mapInventoryItem } from "./mapInventoryItem";

export const updateInventoryItemInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  stock: z.number().int().min(0).optional(),
  adminStock: z.number().int().min(0).optional(),
  type: z.enum(["CUP", "STANDALONE", "SUPPLIES"]),
  costPrice: z.number().min(0).optional(),
});

export const updateInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
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
        type: data.type,
        ...(data.stock !== undefined && { ending_store: data.stock }),
        ...(data.adminStock !== undefined && { ending_admin: data.adminStock }),
        ...(data.costPrice !== undefined && { cost_price: data.costPrice }),
      },
    });

    return mapInventoryItem(updated);
  });
