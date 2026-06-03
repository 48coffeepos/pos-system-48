import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const createInventoryItemInput = z.object({
  name: z.string().min(1).max(200),
  stock: z.number().int(),
  type: z.enum(["CUP", "STANDALONE"]),
  price: z.number().min(0).optional().default(0),
  piecesPerPack: z.number().int().min(1).optional().default(1),
  isSellable: z.boolean().optional().default(true),
});

export const createInventoryItem = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(createInventoryItemInput)
  .handler(async ({ data }) => {
    const inventoryItem = await prisma.inventory.create({
      data: {
        name: data.name,
        stock: data.isSellable ? data.stock : 0,
        admin_stock: data.stock,
        type: data.type,
        price: data.price,
        pieces_per_pack: data.piecesPerPack,
        is_sellable: data.isSellable,
      },
    });

    return {
      id: inventoryItem.inventory_id,
      name: inventoryItem.name,
      stock: inventoryItem.stock,
      adminStock: inventoryItem.admin_stock ?? 0,
      type: inventoryItem.type,
      price: Number(inventoryItem.price),
      piecesPerPack: inventoryItem.pieces_per_pack,
      isSellable: inventoryItem.is_sellable,
    };
  });
