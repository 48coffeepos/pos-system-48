import { createServerFn } from "@tanstack/react-start";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { parseCupInfoKey } from "@/lib/cup-utils";
import { DEFAULT_TIMEZONE, getTodayBounds } from "@/lib/day-bounds";

export const getDashboardData = createServerFn({ method: "GET" })
  .middleware([adminAuthMiddleware()])
  .handler(async () => {
    const tz = process.env.TIMEZONE ?? DEFAULT_TIMEZONE;
    const { start, end } = getTodayBounds(tz);

    const orders = await prisma.order.findMany({
      where: { created_at: { gte: start, lte: end } },
      select: { method: true, grand_total: true },
    });

    const revenueByMethod: Record<string, number> = {
      CASH: 0,
      GCASH: 0,
      GRAB: 0,
    };
    const ordersByMethod: Record<string, number> = {
      CASH: 0,
      GCASH: 0,
      GRAB: 0,
    };
    let totalRevenue = 0;

    for (const order of orders) {
      const total = Number(order.grand_total);
      totalRevenue += total;
      const method = order.method;
      if (method && method in revenueByMethod) {
        revenueByMethod[method] += total;
        ordersByMethod[method] += 1;
      }
    }

    const allCups = await prisma.inventory.findMany({
      where: { type: "CUP" },
      select: { name: true },
      orderBy: { name: "asc" },
    });

    const emptyByMethod: Record<string, number> = {
      CASH: 0,
      GCASH: 0,
      GRAB: 0,
    };

    const cupSalesMap = new Map<
      string,
      { name: string; total: number; byMethod: Record<string, number> }
    >();

    for (const cup of allCups) {
      cupSalesMap.set(cup.name, {
        name: cup.name,
        total: 0,
        byMethod: { ...emptyByMethod },
      });
    }

    const todayOrderItems = await prisma.orderItem.findMany({
      where: {
        order: { created_at: { gte: start, lte: end } },
      },
      select: {
        quantity: true,
        snapshot_inventory: true,
        menu_id: true,
        order: { select: { method: true } },
      },
    });

    const menuInvLinks = await prisma.menuInventory.findMany({
      where: { inventory: { type: "CUP" } },
      select: { menu_id: true, inventory: { select: { name: true } } },
    });

    const menuInvMap = new Map<string, string[]>();
    for (const link of menuInvLinks) {
      const list = menuInvMap.get(link.menu_id) ?? [];
      list.push(link.inventory.name);
      menuInvMap.set(link.menu_id, list);
    }

    for (const item of todayOrderItems) {
      const method = item.order?.method;
      if (!method) continue;

      let matchedInventoryName: string | null = null;

      if (item.menu_id) {
        const names = menuInvMap.get(item.menu_id) ?? [];
        if (
          item.snapshot_inventory &&
          names.includes(item.snapshot_inventory)
        ) {
          matchedInventoryName = item.snapshot_inventory;
        } else {
          for (const name of names) {
            if (cupSalesMap.has(name)) {
              matchedInventoryName = name;
              break;
            }
          }
        }
      }

      if (!matchedInventoryName && item.snapshot_inventory) {
        if (cupSalesMap.has(item.snapshot_inventory)) {
          matchedInventoryName = item.snapshot_inventory;
        } else {
          for (const invName of cupSalesMap.keys()) {
            if (parseCupInfoKey(invName) === item.snapshot_inventory) {
              matchedInventoryName = invName;
              break;
            }
          }
        }
      }

      if (matchedInventoryName) {
        const entry = cupSalesMap.get(matchedInventoryName)!;
        entry.total += item.quantity;
        if (method in entry.byMethod) {
          entry.byMethod[method] += item.quantity;
        }
      }
    }

    return {
      revenue: {
        total: totalRevenue,
        byMethod: revenueByMethod,
        totalOrders: orders.length,
        ordersByMethod,
      },
      cupSales: Array.from(cupSalesMap.values()),
      periodLabel: `${start.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: tz,
      })}`,
    };
  });
