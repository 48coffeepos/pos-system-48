import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { getTimeframeBounds } from "@/lib/day-bounds";

export const getAdminReconciliation = createServerFn({ method: "GET" })
  .middleware([adminAuthMiddleware()])
  .inputValidator(z.object({ date: z.enum(["today", "yesterday"]) }))
  .handler(async ({ data }) => {
    const { start, end } = getTimeframeBounds(data.date);

    const [cashOrders, gcashOrders, grabOrders, expenses] = await Promise.all([
      prisma.order.findMany({
        where: {
          created_at: { gte: start, lte: end },
          method: "CASH",
          OR: [
            { note: null },
            { note: { not: { startsWith: "[CANCELED]" } } },
          ],
        },
        select: { grand_total: true },
      }),
      prisma.order.findMany({
        where: {
          created_at: { gte: start, lte: end },
          method: "GCASH",
          OR: [
            { note: null },
            { note: { not: { startsWith: "[CANCELED]" } } },
          ],
        },
        select: { grand_total: true },
      }),
      prisma.order.findMany({
        where: {
          created_at: { gte: start, lte: end },
          method: "GRAB",
          OR: [
            { note: null },
            { note: { not: { startsWith: "[CANCELED]" } } },
          ],
        },
        select: { grand_total: true },
      }),
      prisma.expense.findMany({
        where: { timestamp: { gte: start, lte: end } },
        select: { amount: true, type: true },
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
    let totalExpenses = 0;
    for (const exp of expenses) {
      const amount = Number(exp.amount);
      if (exp.type === "CASH_OUT") {
        totalCashOut += amount;
      } else if (exp.type === "CASH_IN") {
        totalCashIn += amount;
      } else if (exp.type === "EXPENSE") {
        totalExpenses += amount;
      }
    }

    return {
      totalCashSales,
      totalGcashSales,
      totalGrabSales,
      totalCashOut,
      totalCashIn,
      totalExpenses,
    };
  });
