import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";

export interface AddOnRow {
  id: string;
  name: string;
  amount: number;
}

export const getAllAddOns = createServerFn({ method: "GET" })
	.middleware([adminAuthMiddleware()])
	.handler(async () => {
  const addOns = await prisma.addon.findMany({
    orderBy: { name: "asc" },
  });

  return addOns.map((a) => ({
    id: a.addon_id,
    name: a.name,
    amount: Number(a.price),
  }));
});
