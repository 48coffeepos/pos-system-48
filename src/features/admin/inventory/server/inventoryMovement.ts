import type { Inventory } from "@/generated/prisma/client.js";
import type { Prisma } from "@/generated/prisma/client.js";

export type InventoryMovement =
  | { kind: "admin_in"; quantity: number }
  | { kind: "admin_out"; quantity: number }
  | { kind: "store_in"; quantity: number }
  | { kind: "store_out"; quantity: number }
  | { kind: "transfer"; quantity: number }
  | { kind: "sale"; quantity: number };

type TransactionClient = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export async function applyInventoryMovement(
  tx: TransactionClient,
  inventoryId: string,
  movement: InventoryMovement,
): Promise<Inventory> {
  const item = await tx.inventory.findUnique({
    where: { inventory_id: inventoryId },
  });

  if (!item) {
    throw new Error("Inventory item not found.");
  }

  const quantity = movement.quantity;
  if (quantity <= 0) {
    throw new Error("Quantity must be at least 1.");
  }

  let data: Prisma.InventoryUpdateInput;

  switch (movement.kind) {
    case "admin_in":
      data = {
        in_admin: { increment: quantity },
        ending_admin: { increment: quantity },
      };
      break;
    case "admin_out":
      if (item.ending_admin < quantity) {
        throw new Error(
          `Cannot deduct ${quantity} — only ${item.ending_admin} available in stockroom.`,
        );
      }
      data = {
        out_admin: { increment: quantity },
        ending_admin: { decrement: quantity },
      };
      break;
    case "store_in":
      data = {
        in_store: { increment: quantity },
        ending_store: { increment: quantity },
      };
      break;
    case "store_out":
      if (item.ending_store < quantity) {
        throw new Error(
          `Cannot deduct ${quantity} — only ${item.ending_store} available.`,
        );
      }
      data = {
        out_store: { increment: quantity },
        ending_store: { decrement: quantity },
      };
      break;
    case "transfer":
      if (item.ending_admin < quantity) {
        throw new Error(
          `Cannot transfer ${quantity} — only ${item.ending_admin} available in stockroom.`,
        );
      }
      data = {
        out_admin: { increment: quantity },
        ending_admin: { decrement: quantity },
        in_store: { increment: quantity },
        ending_store: { increment: quantity },
      };
      break;
    case "sale":
      if (item.type === "SUPPLIES") {
        throw new Error("SUPPLIES inventory items are not deducted via sales.");
      }
      if (item.ending_store < quantity) {
        throw new Error(
          `Cannot sell ${quantity} — only ${item.ending_store} available in storefront.`,
        );
      }
      data = {
        out_store: { increment: quantity },
        ending_store: { decrement: quantity },
      };
      break;
    default: {
      const _exhaustive: never = movement;
      throw new Error(`Unknown movement kind: ${JSON.stringify(_exhaustive)}`);
    }
  }

  return tx.inventory.update({
    where: { inventory_id: inventoryId },
    data,
  });
}
