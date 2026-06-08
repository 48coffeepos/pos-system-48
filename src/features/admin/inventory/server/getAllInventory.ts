import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { mapInventoryItem } from "./mapInventoryItem";

export const getAllInventory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const items = await prisma.inventory.findMany({
      orderBy: { name: "asc" },
    });

    return items.map(mapInventoryItem);
  });
