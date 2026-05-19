import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "@/integrations/prisma/db";

const createOrderInput = z.object({
  method: z.string(),
  reference_number: z.string().optional(),
  paid: z.number().optional(),
  change: z.number().optional(),
  total: z.number(),
  items: z.array(
    z.object({
      menu_item_id: z.number(),
      name: z.string(),
      quantity: z.number(),
      unit_price: z.number(),
      discount: z.string().optional(),
      discount_name: z.string().optional(),
      discount_id: z.string().optional(),
      subtotal: z.number(),
      total: z.number(),
      note: z.string().optional(),
      cup_type: z.string(),
      cup_size: z.string(),
      addon_items: z
        .array(
          z.object({
            addon_id: z.number(),
            quantity: z.number(),
          })
        )
        .optional(),
    })
  ),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(createOrderInput)
  .handler(async ({ data }) => {
    return await prisma.$transaction(async (tx) => {
      // Get the highest order ID to determine the next serial number
      const lastOrder = await tx.order.findFirst({
        where: {
          order_id: {
            startsWith: "100-",
          },
        },
        orderBy: {
          order_id: "desc",
        },
        select: {
          order_id: true,
        },
      });

      let nextNumber = 1;
      if (lastOrder) {
        const parts = lastOrder.order_id.split("-");
        const currentNum = parseInt(parts[1], 10);
        if (!isNaN(currentNum)) {
          nextNumber = currentNum + 1;
        }
      }

      // Format with leading zeros to 6 digits (e.g. 100-000001)
      const paddedNumber = String(nextNumber).padStart(6, "0");
      const generatedOrderId = `100-${paddedNumber}`;

      // 1. Save the order and its order items
      const order = await tx.order.create({
        data: {
          order_id: generatedOrderId,
          method: data.method,
          reference_number: data.reference_number || null,
          paid: data.paid !== undefined ? data.paid : null,
          change: data.change !== undefined ? data.change : null,
          total: data.total,
          order_items: {
            create: data.items.map((item) => ({
              menu_id: item.menu_item_id,
              name: item.name,
              discount: item.discount || null,
              discount_name: item.discount_name || null,
              discount_id: item.discount_id || null,
              quantity: item.quantity,
              subtotal: item.subtotal,
              total: item.total,
              note: item.note || null,
              cup_type: item.cup_type || null,
              cup_size: item.cup_size || null,
              addon_items: item.addon_items
                ? {
                    create: item.addon_items.map((addon) => ({
                      addon_id: addon.addon_id,
                      quantity: addon.quantity,
                    })),
                  }
                : undefined,
            })),
          },
        },
        include: {
          order_items: {
            include: {
              addon_items: true,
            },
          },
        },
      });

      // 2. Deduct matching cup sizes from the inventory
      for (const item of data.items) {
        if (
          item.cup_type &&
          item.cup_type !== "NONE" &&
          item.cup_size &&
          item.cup_size !== "NONE"
        ) {
          // Normalize cup type and size to match database names, e.g. "12oz Hot" or "16oz Iced"
          const normalizedSize = item.cup_size.toLowerCase(); // "12oz" or "16oz"
          const normalizedType =
            item.cup_type.charAt(0).toUpperCase() +
            item.cup_type.slice(1).toLowerCase(); // "Hot" or "Iced"
          const cupName = `${normalizedSize} ${normalizedType}`;

          await tx.inventory.updateMany({
            where: {
              name: {
                equals: cupName,
                mode: "insensitive", // Perform case-insensitive check just in case
              },
              type: "CUP",
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });
  });
