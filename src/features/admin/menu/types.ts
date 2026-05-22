import type { Inventory_Type } from "@/generated/prisma/enums";

export interface MenuInventoryLink {
  id: string;
  inventoryId: string;
  inventoryName: string;
  inventoryType: Inventory_Type;
  price: number;
}

export interface MenuListItem {
  id: string;
  name: string;
  price: number | null;
  type: Inventory_Type | null;
  menuInventories: MenuInventoryLink[];
}
