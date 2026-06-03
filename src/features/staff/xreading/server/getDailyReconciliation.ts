import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { getTodayBounds } from "@/lib/day-bounds";

export const getDailyReconciliation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { start, end } = getTodayBounds();

    const [cashOrders, gcashOrders, grabOrders, expenses] = await Promise.all([
      prisma.order.findMany({
        where: {
          created_at: { gte: start, lte: end },
          method: "CASH",
        },
        select: { grand_total: true },
      }),
      prisma.order.findMany({
        where: {
          created_at: { gte: start, lte: end },
          method: "GCASH",
        },
        select: { grand_total: true },
      }),
      prisma.order.findMany({
        where: {
          created_at: { gte: start, lte: end },
          method: "GRAB",
        },
        select: { grand_total: true },
      }),
      prisma.expense.findMany({
        where: {
          timestamp: { gte: start, lte: end },
        },
        select: { amount: true, type: true, description: true },
      }),
    ]);

    const totalCashSales = cashOrders.reduce(
      (sum, order) => sum + Number(order.grand_total),
      0,
    );

    const totalGcashSales = gcashOrders.reduce(
      (sum, order) => sum + Number(order.grand_total),
      0,
    );

    const totalGrabSales = grabOrders.reduce(
      (sum, order) => sum + Number(order.grand_total),
      0,
    );

    let totalCashOut = 0;
    let totalCashIn = 0;
    let totalInventoryExpenses = 0;
    for (const exp of expenses) {
      const amount = Number(exp.amount);
      const isInventory = exp.description?.startsWith("Inventory:");
      if (isInventory) {
        totalInventoryExpenses += amount;
      }
      if (exp.type === "CASH_OUT" && !isInventory) {
        totalCashOut += amount;
      } else if (exp.type === "CASH_IN") {
        totalCashIn += amount;
      }
    }

    return {
      totalCashSales,
      totalGcashSales,
      totalGrabSales,
      totalCashOut,
      totalCashIn,
      totalInventoryExpenses,
    };
  });
