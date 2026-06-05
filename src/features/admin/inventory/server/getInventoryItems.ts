import { createServerFn } from "@tanstack/react-start";

import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { mapInventoryItem } from "./mapInventoryItem";

export const getInventoryItems = createServerFn({ method: "GET" })
  .middleware([adminAuthMiddleware()])
  .handler(async () => {
    const items = await prisma.inventory.findMany({
      orderBy: { name: "asc" },
    });

    return items.map(mapInventoryItem);
  });
