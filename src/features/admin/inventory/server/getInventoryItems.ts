import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";

export const getInventoryItems = createServerFn({ method: "GET" }).handler(
  async () => {
    return await prisma.inventory.findMany({
      orderBy: [
        { type: "asc" },
        { name: "asc" },
      ],
    });
  }
);
