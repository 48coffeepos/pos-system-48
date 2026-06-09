import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/features/auth/middlewares";
import { ROLES } from "@/features/auth/roles";
import { prisma } from "@/integrations/prisma/db";

export const getInventoryLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { session } = context;
    const isAdmin = session.user.role === ROLES.admin;

    const logs = await prisma.inventoryLog.findMany({
      where: isAdmin
        ? undefined
        : {
            OR: [
              { log_by: session.user.name },
              { type: "TRANSFER", location: "STOREFRONT" },
            ],
          },
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
      columnName: log.column_name,
    }));
  });
