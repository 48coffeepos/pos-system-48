import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const getInventoryLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const logs = await prisma.inventoryLog.findMany({
      orderBy: { date_time: "desc" },
    });

    return logs.map((log) => ({
      id: log.inventory_log_id,
      dateTime: log.date_time,
      inventoryItem: log.inventory_item,
      logBy: log.log_by,
      type: log.type,
      location: log.location,
      quantity: log.quantity,
      expense: log.expense ? Number(log.expense) : null,
    }));
  });
