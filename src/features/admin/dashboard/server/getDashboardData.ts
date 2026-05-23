import { createServerFn } from "@tanstack/react-start";

import { prisma } from "@/integrations/prisma/db";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { start, end };
}

export const getDashboardData = createServerFn({ method: "GET" }).handler(
  async () => {
    const { start, end } = getTodayRange();

    const orders = await prisma.order.findMany({
      where: { created_at: { gte: start, lt: end } },
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

	const cupOrderItems = await prisma.orderItem.findMany({
		where: {
			order: { created_at: { gte: start, lt: end } },
			menu: { type: "CUP" },
		},
		select: {
			quantity: true,
			snapshot_inventory: true,
			order: { select: { method: true } },
		},
	});

	for (const item of cupOrderItems) {
		const cupName = item.snapshot_inventory;
		if (!cupName) continue;
      const method = item.order?.method;
      if (!method) continue;

      const entry = cupSalesMap.get(cupName);
      if (!entry) continue;

      entry.total += item.quantity;
      if (method in entry.byMethod) {
        entry.byMethod[method] += item.quantity;
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
      })}`,
    };
  },
);
