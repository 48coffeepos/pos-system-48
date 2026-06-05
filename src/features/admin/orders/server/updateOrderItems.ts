import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { seniorPwdDiscountAmount } from "@/features/staff/pos/utils/order-discount";

export const updateOrderItemsInput = z.object({
  orderId: z.string(),
  items: z.array(
    z.object({
      order_item_id: z.string(),
      quantity: z.number().int().min(1),
      // Fields needed for new items:
      menu_id: z.string().optional(),
      snapshot_menu_name: z.string().optional(),
      snapshot_inventory: z.string().optional(),
      unit_price: z.number().optional(),
    })
  ).min(1, "Order must have at least one item"),
});

export const updateOrderItems = createServerFn({ method: "POST" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(updateOrderItemsInput)
  .handler(async ({ data }) => {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { order_id: data.orderId },
        include: {
          order_items: {
            include: { addon_items: true },
          },
        },
      });

      if (!order) throw new Error("Order not found");

      const existingItemsMap = new Map(
        order.order_items.map((item) => [item.order_item_id, item])
      );

      const requestedItemIds = new Set(data.items.map((i) => i.order_item_id));

      // 1. Restore stock for deleted items and delete them
      for (const existingItem of order.order_items) {
        if (!requestedItemIds.has(existingItem.order_item_id)) {
          // This item is being removed
          const inv = await tx.inventory.findUnique({
            where: { name: existingItem.snapshot_inventory },
          });

          if (inv) {
            await tx.inventory.update({
              where: { inventory_id: inv.inventory_id },
              data: { stock: { increment: existingItem.quantity } },
            });
          }

          // Delete addons first if needed (Cascade usually handles it, but just in case)
          await tx.orderItem.delete({
            where: { order_item_id: existingItem.order_item_id },
          });
        }
      }

      // 2. Adjust stock for modified items, handle new items, and calculate new line totals
      let newGrandTotal = 0;
      const isGrab = order.method === "GRAB";

      for (const requestedItem of data.items) {
        if (requestedItem.order_item_id.startsWith("new-")) {
          // Create new item
          if (!requestedItem.snapshot_inventory || !requestedItem.unit_price || !requestedItem.snapshot_menu_name) {
            throw new Error("Missing data for new item");
          }

          const inv = await tx.inventory.findUnique({
            where: { name: requestedItem.snapshot_inventory },
          });

          if (inv) {
            await tx.inventory.update({
              where: { inventory_id: inv.inventory_id },
              data: { stock: { decrement: requestedItem.quantity } },
            });
          }

          const subtotal = requestedItem.unit_price * requestedItem.quantity;
          const newLineTotal = isGrab ? 0 : subtotal;

          newGrandTotal += newLineTotal;

          await tx.orderItem.create({
            data: {
              order_id: data.orderId,
              menu_id: requestedItem.menu_id || null,
              snapshot_menu_name: requestedItem.snapshot_menu_name,
              snapshot_price: requestedItem.unit_price,
              snapshot_inventory: requestedItem.snapshot_inventory,
              unit_price: requestedItem.unit_price,
              quantity: requestedItem.quantity,
              line_total: newLineTotal,
              loyalty: false,
              discount_amount: 0,
            },
          });
        } else {
          // Update existing item
          const existingItem = existingItemsMap.get(requestedItem.order_item_id);
          if (!existingItem) {
            throw new Error(`Item ${requestedItem.order_item_id} not found in order`);
          }

          const quantityDiff = requestedItem.quantity - existingItem.quantity;

          // Adjust inventory
          if (quantityDiff !== 0) {
            const inv = await tx.inventory.findUnique({
              where: { name: existingItem.snapshot_inventory },
            });

            if (inv) {
              await tx.inventory.update({
                where: { inventory_id: inv.inventory_id },
                data: {
                  stock: {
                    decrement: quantityDiff,
                  },
                },
              });
            }
          }

          // Recalculate line total
          let newLineTotal = 0;
          let discountAmount = Number(existingItem.discount_amount || 0);
          let addonsTotal = 0;

          if (!existingItem.loyalty && !isGrab) {
            const subtotal = Number(existingItem.unit_price) * requestedItem.quantity;
            
            if (existingItem.discount_type) {
               discountAmount = seniorPwdDiscountAmount(subtotal);
            }
            newLineTotal = subtotal - discountAmount;
          }

          for (const addon of existingItem.addon_items) {
             const newAddonTotal = isGrab ? 0 : Number(addon.addon_price_snapshot) * addon.quantity;
             addonsTotal += newAddonTotal;
             
             if (addon.total_price.toNumber() !== newAddonTotal) {
                 await tx.orderItemAddon.update({
                     where: { order_item_addon_id: addon.order_item_addon_id },
                     data: { total_price: newAddonTotal }
                 });
             }
          }

          const fullLineTotal = newLineTotal;
          newGrandTotal += (fullLineTotal + addonsTotal);

          await tx.orderItem.update({
            where: { order_item_id: existingItem.order_item_id },
            data: {
              quantity: requestedItem.quantity,
              discount_amount: discountAmount,
              line_total: fullLineTotal,
            },
          });
        }
      }

      // 3. Update order grand total and change amount
      const currentAmountTendered = Number(order.amount_tendered || 0);
      const changeAmount = order.method === "CASH" 
        ? Math.max(0, currentAmountTendered - newGrandTotal)
        : 0;

      await tx.order.update({
        where: { order_id: order.order_id },
        data: {
          grand_total: newGrandTotal,
          change_amount: changeAmount,
        },
      });

      return { success: true };
    });
  });
