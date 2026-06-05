import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { mapInventoryItem } from "./mapInventoryItem";

export const updateInventoryItemInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  stock: z.number().int().min(0).optional(),
  outAdmin: z.number().int().min(0).optional(),
  type: z.enum(["CUP", "STANDALONE", "SUPPLIES"]),
  costPrice: z.number().min(0).optional(),
});

export const updateInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(updateInventoryItemInput)
  .handler(async ({ data, context }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.id },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    const logBy = context.session.user.name;
    const logs: Array<{
      inventory_item: string;
      log_by: string;
      quantity: number;
      expense?: number;
      type: "EDIT";
      location: "STOCKROOM" | "STOREFRONT";
    }> = [];

    const updateData: Record<string, unknown> = {
      name: data.name,
      type: data.type,
    };

    if (data.outAdmin !== undefined) {
      const syncedEnding = existing.beginning_admin + existing.in_admin - data.outAdmin;

      updateData.out_admin = data.outAdmin;
      updateData.ending_admin = syncedEnding;

      if (data.outAdmin !== existing.out_admin) {
        const delta = data.outAdmin - existing.out_admin;
        const unitPrice = existing.cost_price ? Number(existing.cost_price) : 0;
        const expense = -(delta * unitPrice);

        logs.push({
          inventory_item: existing.name,
          log_by: logBy,
          quantity: delta,
          expense,
          type: "EDIT",
          location: "STOCKROOM",
        });
      }
    }

    if (data.stock !== undefined && data.stock < existing.ending_store) {
      const delta = data.stock - existing.ending_store;

      logs.push({
        inventory_item: existing.name,
        log_by: logBy,
        quantity: delta,
        type: "EDIT",
        location: "STOREFRONT",
      });

      updateData.ending_store = data.stock;
    }

    if (data.costPrice !== undefined) {
      updateData.cost_price = data.costPrice;
    }

    if (logs.length > 0) {
      await prisma.inventoryLog.createMany({ data: logs });
    }

    const updated = await prisma.inventory.update({
      where: { inventory_id: data.id },
      data: updateData,
    });

    return mapInventoryItem(updated);
  });
