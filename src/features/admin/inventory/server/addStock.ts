import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const addStockInput = z.object({
  itemId: z.string(),
  quantity: z.number().int().min(1),
  transactionType: z.enum(["add", "transfer"]),
});

export const addStock = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(addStockInput)
  .handler(async ({ data, context }) => {
    const existing = await prisma.inventory.findUnique({
      where: { inventory_id: data.itemId },
    });

    if (!existing) {
      throw new Error("Inventory item not found.");
    }

    if (data.transactionType === "add") {
      const updated = await prisma.inventory.update({
        where: { inventory_id: data.itemId },
        data: {
          admin_stock: (existing.admin_stock ?? 0) + data.quantity,
        },
      });

      return {
        id: updated.inventory_id,
        name: updated.name,
        stock: updated.stock,
        adminStock: updated.admin_stock ?? 0,
        type: updated.type,
        price: Number(updated.price),
        piecesPerPack: updated.pieces_per_pack,
        isSellable: updated.is_sellable,
      };
    }

    // transfer
    const currentAdminStock = existing.admin_stock ?? 0;
    const piecesPerPack = existing.pieces_per_pack;

    const stockIncrease = existing.is_sellable
      ? data.quantity * piecesPerPack
      : 0;

    const updated = await prisma.inventory.update({
      where: { inventory_id: data.itemId },
      data: {
        stock: existing.stock + stockIncrease,
        admin_stock: currentAdminStock - data.quantity,
      },
    });

    const price = Number(existing.price);
    if (price > 0) {
      await prisma.expense.create({
        data: {
          staff_id: context.session.user.id,
          type: "CASH_OUT",
          description: `Inventory: ${existing.name} x${data.quantity} pack(s)`,
          amount: data.quantity * price,
        },
      });
    }

    return {
      id: updated.inventory_id,
      name: updated.name,
      stock: updated.stock,
      adminStock: updated.admin_stock ?? 0,
      type: updated.type,
      price: Number(updated.price),
      piecesPerPack: updated.pieces_per_pack,
      isSellable: updated.is_sellable,
    };
  });
