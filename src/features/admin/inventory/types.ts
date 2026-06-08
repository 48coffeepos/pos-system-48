export type InventoryItemType = "CUP" | "STANDALONE" | "SUPPLIES";

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
