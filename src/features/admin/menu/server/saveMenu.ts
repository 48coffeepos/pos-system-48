import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { Inventory_Type } from "@/generated/prisma/enums";
import { prisma } from "@/integrations/prisma/db";

export const saveMenuInput = z
  .object({
    mode: z.union([z.literal("create"), z.literal("edit")]),
    menuId: z.string().optional(),
    name: z.string().trim().min(1).max(200),
    trackInventory: z.boolean(),
    price: z.number().positive().optional(),
    itemType: z
      .enum([Inventory_Type.CUP, Inventory_Type.STANDALONE])
      .optional(),
    selectedCupIds: z.array(z.string()),
    cupPrices: z.record(z.string(), z.number()),
    standaloneMode: z
      .union([z.literal("existing"), z.literal("new")])
      .optional(),
    selectedInventoryId: z.string().optional(),
    newInventoryName: z.string().optional(),
    standalonePrice: z.number().positive().optional(),
  })
  .refine((data) => !data.trackInventory || data.itemType !== undefined, {
    message: "Item type is required when tracking inventory.",
    path: ["itemType"],
  });

export type SaveMenuInput = z.infer<typeof saveMenuInput>;

function normalizeMenuError(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("Unique constraint failed")) {
      return new Error("A menu item with this name already exists.");
    }

    return error;
  }

  return new Error("Failed to save menu item.");
}

export const saveMenu = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(saveMenuInput)
  .handler(async ({ data }) => {
    try {
      const menuId = data.menuId ?? undefined;

      const menu = await prisma.$transaction(async (tx) => {
        const existingMenu =
          menuId == null
            ? null
            : await tx.menu.findUnique({
                where: { menu_id: menuId },
                include: { inventory_items: true },
              });

        if (menuId != null && !existingMenu) {
          throw new Error("Menu item not found.");
        }

        const menuType = data.trackInventory ? data.itemType : null;

        let resolvedMenuId = menuId;

        if (resolvedMenuId == null) {
          const created = await tx.menu.create({
            data: {
              name: data.name,
              price: data.trackInventory ? null : (data.price ?? null),
              type: menuType,
            },
          });

          resolvedMenuId = created.menu_id;
        } else {
          await tx.menu.update({
            where: { menu_id: resolvedMenuId },
            data: {
              name: data.name,
              price: data.trackInventory ? null : (data.price ?? null),
              type: menuType,
            },
          });
        }

        await tx.menuInventory.deleteMany({
          where: { menu_id: resolvedMenuId },
        });

        if (!data.trackInventory) {
          return tx.menu.findUnique({
            where: { menu_id: resolvedMenuId },
            include: { inventory_items: { include: { inventory: true } } },
          });
        }

        if (data.itemType === Inventory_Type.CUP) {
          const cupLinks = data.selectedCupIds
            .map((cupId) => ({ cupId, price: data.cupPrices[cupId] }))
            .filter(
              (entry): entry is { cupId: string; price: number } =>
                typeof entry.price === "number" && entry.price > 0,
            );

          if (cupLinks.length === 0) {
            throw new Error("Select at least one cup size.");
          }

          await tx.menuInventory.createMany({
            data: cupLinks.map((entry) => ({
              menu_id: resolvedMenuId,
              inventory_id: entry.cupId,
              price: entry.price,
            })),
          });
        }

        if (data.itemType === Inventory_Type.STANDALONE) {
          const standalonePrice = data.standalonePrice;

          if (standalonePrice == null || standalonePrice <= 0) {
            throw new Error("Standalone price is required.");
          }

          if (data.standaloneMode === "existing") {
            if (!data.selectedInventoryId) {
              throw new Error("Select an inventory item.");
            }

            await tx.menuInventory.create({
              data: {
                menu_id: resolvedMenuId,
                inventory_id: data.selectedInventoryId,
                price: standalonePrice,
              },
            });
          }

          if (data.standaloneMode === "new") {
            const inventoryName = data.newInventoryName?.trim();

            if (!inventoryName) {
              throw new Error("Inventory name is required.");
            }

            const createdInventory = await tx.inventory.create({
              data: {
                name: inventoryName,
                stock: 0,
                type: Inventory_Type.STANDALONE,
              },
            });

            await tx.menuInventory.create({
              data: {
                menu_id: resolvedMenuId,
                inventory_id: createdInventory.inventory_id,
                price: standalonePrice,
              },
            });
          }
        }

        return tx.menu.findUnique({
          where: { menu_id: resolvedMenuId },
          include: { inventory_items: { include: { inventory: true } } },
        });
      });

      if (!menu) {
        throw new Error("Menu item was not saved.");
      }

      return {
        id: menu.menu_id,
        name: menu.name,
        price: menu.price == null ? null : Number(menu.price),
        type: menu.type,
        inventory_items: menu.inventory_items.map((menuInventory) => ({
          id: menuInventory.menu_inv_id,
          inventoryId: menuInventory.inventory_id,
          inventoryName: menuInventory.inventory.name,
          inventoryType: menuInventory.inventory.type,
          price: Number(menuInventory.price),
        })),
      };
    } catch (error) {
      throw normalizeMenuError(error);
    }
  });
