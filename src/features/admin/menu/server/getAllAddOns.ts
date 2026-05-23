import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/integrations/prisma/db";

export interface AddOnRow {
  id: string;
  name: string;
  amount: number;
}

export const getAllAddOns = createServerFn({ method: "GET" }).handler(async () => {
  const addOns = await prisma.addon.findMany({
    orderBy: { name: "asc" },
  });

  return addOns.map((a) => ({
    id: a.addon_id,
    name: a.name,
    amount: Number(a.price),
  }));
});
