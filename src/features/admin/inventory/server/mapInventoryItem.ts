import type { Inventory } from "@/generated/prisma/client.js";
import type { InventoryItem } from "../types";

export function mapInventoryItem(item: Inventory): InventoryItem {
  const calculatedEndingAdmin = item.beginning_admin + item.in_admin - item.out_admin;

  return {
    id: item.inventory_id,
    name: item.name,
    type: item.type,
    costPrice: item.cost_price ? Number(item.cost_price) : 0,
    beginningAdmin: item.beginning_admin,
    inAdmin: item.in_admin,
    outAdmin: item.out_admin,
    endingAdmin: calculatedEndingAdmin,
    beginningStore: item.beginning_store,
    inStore: item.in_store,
    outStore: item.out_store,
    endingStore: item.ending_store,
    adminStock: calculatedEndingAdmin,
    stock: item.ending_store,
    yesterdayStock: item.beginning_store,
  };
}
