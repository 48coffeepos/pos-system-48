import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export interface AvailableMonth {
  year: number;
  month: number;
  label: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const getAvailableMonths = createServerFn({ method: "GET" })
  .middleware([adminAuthMiddleware()])
  .handler(async () => {
    const [orderMonths, expenseMonths] = await Promise.all([
      prisma.$queryRaw<Array<{ year: number; month: number }>>`
        SELECT DISTINCT EXTRACT(YEAR FROM created_at)::int AS year, EXTRACT(MONTH FROM created_at)::int AS month
        FROM orders
        ORDER BY year DESC, month DESC
      `,
      prisma.$queryRaw<Array<{ year: number; month: number }>>`
        SELECT DISTINCT EXTRACT(YEAR FROM timestamp)::int AS year, EXTRACT(MONTH FROM timestamp)::int AS month
        FROM expenses
        ORDER BY year DESC, month DESC
      `,
    ]);

    const seen = new Set<string>();
    const months: AvailableMonth[] = [];

    for (const row of orderMonths) {
      const key = `${row.year}-${String(row.month).padStart(2, "0")}`;
      if (!seen.has(key)) {
        seen.add(key);
        months.push({
          year: row.year,
          month: row.month,
          label: `${MONTH_NAMES[row.month - 1]} ${row.year}`,
        });
      }
    }

    for (const row of expenseMonths) {
      const key = `${row.year}-${String(row.month).padStart(2, "0")}`;
      if (!seen.has(key)) {
        seen.add(key);
        months.push({
          year: row.year,
          month: row.month,
          label: `${MONTH_NAMES[row.month - 1]} ${row.year}`,
        });
      }
    }

    months.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return months;
  });
