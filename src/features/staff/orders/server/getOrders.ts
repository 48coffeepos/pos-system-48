import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";

export const getOrders = createServerFn({ method: "GET" }).handler(async () => {
  return await prisma.order.findMany({
    include: {
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
});
