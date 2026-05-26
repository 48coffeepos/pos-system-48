import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export const getInventoryItems = createServerFn({ method: "GET" })
  .middleware([adminAuthMiddleware()])
  .handler(async () => {
    return await prisma.inventory.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  });
