import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middlewares";
import { prisma } from "@/integrations/prisma/db";
import { parseCupInfoKey } from "@/lib/cup-utils";
import { getTodayBounds } from "@/lib/day-bounds";

export interface CupSale {
  name: string;
  total: number;
  byMethod: Record<string, number>;
}

export const getCupSales = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { start, end } = getTodayBounds();

    const allCups = await prisma.inventory.findMany({
      where: { type: "CUP" },
      select: { name: true },
      orderBy: { name: "asc" },
    });

    const emptyByMethod: Record<string, number> = {
      CASH: 0,
      GCASH: 0,
      GRAB: 0,
    };

    const cupSalesMap = new Map<string, CupSale>();
    for (const cup of allCups) {
      cupSalesMap.set(cup.name, {
        name: cup.name,
        total: 0,
        byMethod: { ...emptyByMethod },
      });
    }

    const todayOrderItems = await prisma.orderItem.findMany({
      where: {
        order: { created_at: { gte: start, lte: end } },
      },
      select: {
        quantity: true,
        snapshot_inventory: true,
        menu_id: true,
        order: { select: { method: true } },
      },
    });

    const menuInvLinks = await prisma.menuInventory.findMany({
      where: { inventory: { type: "CUP" } },
      select: { menu_id: true, inventory: { select: { name: true } } },
    });

    const menuInvMap = new Map<string, string[]>();
    for (const link of menuInvLinks) {
      const list = menuInvMap.get(link.menu_id) ?? [];
      list.push(link.inventory.name);
      menuInvMap.set(link.menu_id, list);
    }

    for (const item of todayOrderItems) {
      const method = item.order?.method;
      if (!method) continue;

      let matchedInventoryName: string | null = null;

      if (item.menu_id) {
        const names = menuInvMap.get(item.menu_id) ?? [];
        if (item.snapshot_inventory && names.includes(item.snapshot_inventory)) {
          matchedInventoryName = item.snapshot_inventory;
        } else {
          for (const name of names) {
            if (cupSalesMap.has(name)) {
              matchedInventoryName = name;
              break;
            }
          }
        }
      }

      if (!matchedInventoryName && item.snapshot_inventory) {
        if (cupSalesMap.has(item.snapshot_inventory)) {
          matchedInventoryName = item.snapshot_inventory;
        } else {
          for (const invName of cupSalesMap.keys()) {
            if (parseCupInfoKey(invName) === item.snapshot_inventory) {
              matchedInventoryName = invName;
              break;
            }
          }
        }
      }

      if (matchedInventoryName) {
        const entry = cupSalesMap.get(matchedInventoryName)!;
        entry.total += item.quantity;
        if (method in entry.byMethod) {
          entry.byMethod[method] += item.quantity;
        }
      }
    }

    return Array.from(cupSalesMap.values());
  });
