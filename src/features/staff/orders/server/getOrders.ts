import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const getOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { note: null },
          { note: { not: { startsWith: "[CANCELED]" } } },
        ],
      },
      include: {
        staff: true,
        order_items: {
          include: {
            addon_items: {
              include: {
                addon: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return orders.map((order) => ({
      ...order,
      amount_tendered: order.amount_tendered
        ? Number(order.amount_tendered)
        : null,
      change_amount: order.change_amount ? Number(order.change_amount) : null,
      grand_total: Number(order.grand_total),
      note: order.note || null,
      cashier_name: order.staff?.name?.trim() || "Cashier",
      staff: { name: order.staff?.name?.trim() || "Cashier" },
      order_items: order.order_items.map((item) => ({
        ...item,
        snapshot_price: Number(item.snapshot_price),
        unit_price: Number(item.unit_price),
        line_total: Number(item.line_total),
        discount_amount: item.discount_type
          ? Number(item.discount_amount)
          : null,
        addon_items: item.addon_items.map((addon) => ({
          ...addon,
          addon_price_snapshot: Number(addon.addon_price_snapshot),
          total_price: Number(addon.total_price),
          addon: {
            ...addon.addon,
            price: Number(addon.addon.price),
          },
        })),
      })),
    }));
  });
