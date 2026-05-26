import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const deleteInventoryItemInput = z.object({
  id: z.string(),
});

export const deleteInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(deleteInventoryItemInput)
  .handler(async ({ data }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.id },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    await prisma.inventory.delete({
      where: { inventory_id: data.id },
    });

    return { success: true };
  });
