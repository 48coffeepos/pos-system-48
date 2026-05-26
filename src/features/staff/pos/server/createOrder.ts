import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/features/auth/middlewares";
import { Prisma } from "@/generated/prisma/client.js";
import type {
  Discount_Type,
  Payment_Method,
} from "@/generated/prisma/enums.js";
import { prisma } from "@/integrations/prisma/db";
import { getPusher } from "@/integrations/pusher/server";
import { seniorPwdDiscountAmount } from "../utils/order-discount";

const MAX_ORDER_ID_RETRIES = 3;

const createOrderItemSchema = z.object({
  menu_id: z.string(),
  snapshot_menu_name: z.string(),
  snapshot_inventory: z.string(),
  quantity: z.number().int().min(1),
  unit_price: z.number(),
  discount_type: z.enum(["PWD", "SENIOR"]).optional(),
  discount_contact: z.string().optional(),
  discount_id_number: z.string().optional(),
  line_total: z.number(),
  is_free_drink: z.boolean().optional(),
  note: z.string().optional(),
  cup_type: z.string(),
  cup_size: z.string(),
  selected_inventory_id: z.string().optional(),
  addon_items: z
    .array(
      z.object({
        addon_id: z.string(),
        addon_name_snapshot: z.string(),
        addon_price_snapshot: z.number(),
        quantity: z.number().int().min(1),
      }),
    )
    .optional(),
});

const createOrderInput = z
  .object({
    method: z.enum(["CASH", "GCASH", "GRAB"]),
    reference_number: z.string().optional(),
    amount_tendered: z.number().optional(),
    change_amount: z.number().optional(),
    grand_total: z.number(),
    note: z.string().optional(),
    items: z.array(createOrderItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const itemsTotal = data.items.reduce(
      (sum, item) => sum + item.line_total,
      0,
    );
    if (Math.abs(itemsTotal - data.grand_total) > 0.01) {
      ctx.addIssue({
        code: "custom",
        message: "Grand total does not match the sum of line items.",
        path: ["grand_total"],
      });
    }

    if (data.method === "GCASH" || data.method === "GRAB") {
      if (!data.reference_number?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Reference number is required for this payment method.",
          path: ["reference_number"],
        });
      }
    }

    if (data.method === "CASH") {
      if ((data.amount_tendered ?? 0) < data.grand_total) {
        ctx.addIssue({
          code: "custom",
          message: "Amount tendered must be at least the grand total.",
          path: ["amount_tendered"],
        });
      }
    }
  });

type CreateOrderItem = z.infer<typeof createOrderItemSchema>;

function isOrderIdUniqueViolation(
  error: Prisma.PrismaClientKnownRequestError,
): boolean {
  const target = error.meta?.target;
  if (Array.isArray(target)) {
    return target.includes("order_id");
  }
  if (typeof target === "string") {
    return target.includes("order_id");
  }
  return false;
}

async function decrementStockForItem(
  tx: Prisma.TransactionClient,
  item: Pick<CreateOrderItem, "menu_id" | "quantity" | "selected_inventory_id">,
) {
  if (item.selected_inventory_id) {
    await tx.inventory.update({
      where: { inventory_id: item.selected_inventory_id },
      data: { stock: { decrement: item.quantity } },
    });
    return;
  }

  const menuInventoryLinks = await tx.menuInventory.findMany({
    where: { menu_id: item.menu_id },
    select: { inventory_id: true },
  });

  if (menuInventoryLinks.length === 0) {
    return;
  }

  if (menuInventoryLinks.length === 1) {
    await tx.inventory.update({
      where: { inventory_id: menuInventoryLinks[0].inventory_id },
      data: { stock: { decrement: item.quantity } },
    });
    return;
  }

  throw new Error(
    "Cup or size selection is required for this menu item. Please customize the item before checkout.",
  );
}

async function createOrderInTransaction(
  data: z.infer<typeof createOrderInput>,
  userId: string,
) {
  return prisma.$transaction(async (tx) => {
    const lastOrder = await tx.order.findFirst({
      where: { order_id: { startsWith: "100-" } },
      orderBy: { order_id: "desc" },
      select: { order_id: true },
    });

    let nextNumber = 1;
    if (lastOrder) {
      const parts = lastOrder.order_id.split("-");
      const currentNum = parseInt(parts[1], 10);
      if (!Number.isNaN(currentNum)) {
        nextNumber = currentNum + 1;
      }
    }

    const paddedNumber = String(nextNumber).padStart(6, "0");
    const generatedOrderId = `100-${paddedNumber}`;

    const order = await tx.order.create({
      data: {
        order_id: generatedOrderId,
        staff_id: userId,
        method: data.method as Payment_Method,
        reference_number: data.reference_number?.trim() || null,
        amount_tendered:
          data.amount_tendered !== undefined ? data.amount_tendered : null,
        change_amount:
          data.change_amount !== undefined ? data.change_amount : null,
        grand_total: data.grand_total,
        note: data.note || null,
        order_items: {
          create: await Promise.all(
            data.items.map(async (item) => {
              let invSnapshot = item.snapshot_inventory;
              if (item.selected_inventory_id) {
                const inv = await tx.inventory.findUnique({
                  where: { inventory_id: item.selected_inventory_id },
                  select: { name: true },
                });
                if (inv) invSnapshot = inv.name;
              }

              const hasDiscount = Boolean(item.discount_type);
              const discountAmount = hasDiscount
                ? seniorPwdDiscountAmount(item.line_total)
                : 0;

              return {
                menu_id: item.menu_id,
                snapshot_menu_name: item.snapshot_menu_name,
                snapshot_price: item.unit_price,
                snapshot_inventory: invSnapshot,
                unit_price: item.unit_price,
                quantity: item.quantity,
                line_total: item.line_total,
                loyalty: item.is_free_drink === true,
                discount_amount: discountAmount,
                discount_type: (item.discount_type as Discount_Type) || null,
                discount_id_number: item.discount_id_number || null,
                discount_contact: item.discount_contact || null,
                addon_items: item.addon_items
                  ? {
                      create: item.addon_items.map((addon) => ({
                        addon_id: addon.addon_id,
                        addon_name_snapshot: addon.addon_name_snapshot,
                        addon_price_snapshot: addon.addon_price_snapshot,
                        quantity: addon.quantity,
                        total_price:
                          addon.addon_price_snapshot * addon.quantity,
                      })),
                    }
                  : undefined,
              };
            }),
          ),
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

    for (const item of data.items) {
      await decrementStockForItem(tx, item);
    }

    return {
      ...order,
      amount_tendered: order.amount_tendered
        ? Number(order.amount_tendered)
        : null,
      change_amount: order.change_amount ? Number(order.change_amount) : null,
      grand_total: Number(order.grand_total),
      order_items: order.order_items.map((orderItem) => ({
        ...orderItem,
        snapshot_price: Number(orderItem.snapshot_price),
        unit_price: Number(orderItem.unit_price),
        line_total: Number(orderItem.line_total),
        discount_amount: orderItem.discount_type
          ? Number(orderItem.discount_amount)
          : null,
        addon_items: orderItem.addon_items.map((addon) => ({
          ...addon,
          addon_price_snapshot: Number(addon.addon_price_snapshot),
          total_price: Number(addon.total_price),
        })),
      })),
    };
  });
}

export const createOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(createOrderInput)
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    let order: Awaited<ReturnType<typeof createOrderInTransaction>> | undefined;

    for (let attempt = 0; attempt < MAX_ORDER_ID_RETRIES; attempt++) {
      try {
        order = await createOrderInTransaction(data, userId);
        break;
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2002" &&
          isOrderIdUniqueViolation(err)
        ) {
          if (attempt === MAX_ORDER_ID_RETRIES - 1) {
            throw new Error(
              "Could not generate a unique order number. Please try again.",
            );
          }
          continue;
        }
        throw err;
      }
    }

    if (!order) {
      throw new Error(
        "Could not generate a unique order number. Please try again.",
      );
    }

    let pusherPublished = false;
    try {
      const pusher = getPusher();
      if (pusher) {
        await pusher.trigger("orders", "new-order", order);
        pusherPublished = true;
      }
    } catch (err) {
      console.error("Failed to publish Pusher event:", err);
    }

    return { ...order, pusherPublished };
  });
