import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { DEFAULT_TIMEZONE } from "@/lib/day-bounds";

function getMonthBounds(tz: string, year: number, month: number) {
  const monthPadded = String(month).padStart(2, "0");
  const start = new Date(`${year}-${monthPadded}-01T00:00:00+08:00`);
  const nextMonth = month + 1;
  const nextMonthPadded = String(nextMonth).padStart(2, "0");
  const endYear = nextMonth > 12 ? year + 1 : year;
  const endMonth = nextMonth > 12 ? "01" : nextMonthPadded;
  const end = new Date(`${endYear}-${endMonth}-01T00:00:00+08:00`);

  return { start, end };
}

export const getMonthlyData = createServerFn({ method: "GET" })
  .middleware([adminAuthMiddleware()])
  .handler(async ({ data }: { data: { year: number; month: number } }) => {
    const tz = process.env.TIMEZONE ?? DEFAULT_TIMEZONE;
    const { year, month } = data;
    const { start, end } = getMonthBounds(tz, year, month);

    const [orders, expenses] = await Promise.all([
      prisma.order.findMany({
        where: { created_at: { gte: start, lt: end } },
        select: { method: true, grand_total: true },
      }),
      prisma.expense.findMany({
        where: { timestamp: { gte: start, lt: end } },
        select: { type: true, amount: true },
      }),
    ]);

    const revenueByMethod: Record<string, number> = {
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
      }
    }

    let totalCashOut = 0;
    let totalCashIn = 0;
    let cashOutCount = 0;

    for (const exp of expenses) {
      const amount = Number(exp.amount);
      if (exp.type === "CASH_OUT") {
        totalCashOut += amount;
        cashOutCount++;
      } else if (exp.type === "CASH_IN") {
        totalCashIn += amount;
      }
    }

    const monthName = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "long",
      year: "numeric",
    }).format(start);

    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }).format(date);

    const lastDay = new Date(end.getTime() - 1);

    return {
      revenueByMethod,
      totalRevenue,
      totalCashOut,
      totalCashIn,
      totalExpenses: totalCashOut,
      monthLabel: monthName,
      periodStart: formatDate(start),
      periodEnd: formatDate(lastDay),
      orderCount: orders.length,
      expenseCount: cashOutCount,
    };
  });
