export type InventoryItemType = "CUP" | "STANDALONE" | "SUPPLIES";

export type InventoryTab = "storefront" | "admin" | "logs";

export interface InventoryLogEntry {
  id: string;
  dateTime: Date | null;
  inventoryItem: string;
  logBy: string;
  type: "ADD" | "DEDUCT" | "EDIT" | "TRANSFER";
  location: "STOCKROOM" | "STOREFRONT";
  quantity: number | null;
  expense: number | null;
  columnName?: string | null;
}

export interface InventoryLedger {
  beginningAdmin: number;
  inAdmin: number;
  outAdmin: number;
  endingAdmin: number;
  beginningStore: number;
  inStore: number;
  outStore: number;
  endingStore: number;
}

export interface InventoryItem extends InventoryLedger {
  id: string;
  name: string;
  type: InventoryItemType;
  costPrice: number;
  adminStock: number;
  stock: number;
  yesterdayStock: number;
}
