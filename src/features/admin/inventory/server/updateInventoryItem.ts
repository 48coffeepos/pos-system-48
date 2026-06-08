import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { mapInventoryItem } from "./mapInventoryItem";

export const updateInventoryItemInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  inStore: z.number().int().min(0).optional(),
  outStore: z.number().int().min(0).optional(),
  inAdmin: z.number().int().min(0).optional(),
  outAdmin: z.number().int().min(0).optional(),
  type: z.enum(["CUP", "STANDALONE", "SUPPLIES"]),
  costPrice: z.number().min(0).optional(),
});

export const updateInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(updateInventoryItemInput)
  .handler(async ({ data, context }) => {
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.inventory.findUnique({
        where: { inventory_id: data.id },
      });

      if (!existing) {
        throw new Error("Inventory item not found.");
      }

      const logBy = context.session.user.name;
      const unitPrice = existing.cost_price ? Number(existing.cost_price) : 0;
      const logs: Array<{
        inventory_item: string;
        log_by: string;
        quantity: number;
        expense?: number;
        column_name?: string;
        type: "EDIT";
        location: "STOCKROOM" | "STOREFRONT";
      }> = [];

      const updateData: Record<string, unknown> = {
        name: data.name,
        type: data.type,
      };

      if (data.inAdmin !== undefined || data.outAdmin !== undefined) {
        const newIn = data.inAdmin ?? existing.in_admin;
        const newOut = data.outAdmin ?? existing.out_admin;
        const newEnding = existing.beginning_admin + newIn - newOut;

        if (data.inAdmin !== undefined && data.inAdmin > existing.in_admin) {
          throw new Error(
            `Cannot increase In Admin via edit. Use "Add Stock" to increase quantity.`,
          );
        }

        if (data.inAdmin !== undefined && data.inAdmin < existing.in_admin) {
          const delta = data.inAdmin - existing.in_admin;
          const expense = delta * unitPrice;

          logs.push({
            inventory_item: existing.name,
            log_by: logBy,
            quantity: delta,
            expense,
            column_name: "in_admin",
            type: "EDIT",
            location: "STOCKROOM",
          });
        }

        if (data.outAdmin !== undefined && data.outAdmin !== existing.out_admin) {
          const delta = data.outAdmin - existing.out_admin;

          logs.push({
            inventory_item: existing.name,
            log_by: logBy,
            quantity: delta,
            column_name: "out_admin",
            type: "EDIT",
            location: "STOCKROOM",
          });
        }

        updateData.in_admin = newIn;
        updateData.out_admin = newOut;
        updateData.ending_admin = newEnding;
      }

      if (data.inStore !== undefined || data.outStore !== undefined) {
        const newIn = data.inStore ?? existing.in_store;
        const newOut = data.outStore ?? existing.out_store;
        const newEnding = existing.beginning_store + newIn - newOut;

        if (data.inStore !== undefined && data.inStore !== existing.in_store) {
          const delta = data.inStore - existing.in_store;

          logs.push({
            inventory_item: existing.name,
            log_by: logBy,
            quantity: delta,
            column_name: "in_store",
            type: "EDIT",
            location: "STOREFRONT",
          });
        }

        if (data.outStore !== undefined && data.outStore !== existing.out_store) {
          const delta = data.outStore - existing.out_store;

          logs.push({
            inventory_item: existing.name,
            log_by: logBy,
            quantity: delta,
            column_name: "out_store",
            type: "EDIT",
            location: "STOREFRONT",
          });
        }

        updateData.in_store = newIn;
        updateData.out_store = newOut;
        updateData.ending_store = newEnding;
      }

      if (data.costPrice !== undefined) {
        updateData.cost_price = data.costPrice;
      }

      if (logs.length > 0) {
        await tx.inventoryLog.createMany({ data: logs });
      }

      return tx.inventory.update({
        where: { inventory_id: data.id },
        data: updateData,
      });
    });

    return mapInventoryItem(updated);
  });
