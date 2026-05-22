import { z } from "zod";

export const MenuFormSchema = z.object({
  mode: z.union([z.literal("create"), z.literal("edit")]),
  menuId: z.string().optional(),
  name: z.string().trim().min(1, "Name is required"),
  trackInventory: z.boolean(),
  price: z.number().optional(),
  itemType: z.enum(["CUP", "STANDALONE"]).optional(),
  selectedCupIds: z.array(z.string()),
  cupPrices: z.record(z.string(), z.number()),
  standaloneMode: z.enum(["existing", "new"]).optional(),
  selectedInventoryId: z.string(),
  newInventoryName: z.string(),
  standalonePrice: z.number().optional(),
})
  .refine(
    (d) => d.trackInventory || (d.price != null && d.price > 0),
    { message: "Price is required", path: ["price"] },
  )
  .refine(
    (d) =>
      !d.trackInventory ||
      d.itemType !== "CUP" ||
      d.selectedCupIds.length > 0,
    { message: "Select at least one cup size", path: ["selectedCupIds"] },
  )
  .refine(
    (d) =>
      !d.trackInventory ||
      d.itemType !== "CUP" ||
      d.selectedCupIds.every((id) => (d.cupPrices[id] ?? 0) > 0),
    {
      message: "All selected cups need a price",
      path: ["cupPrices"],
    },
  )
  .refine(
    (d) =>
      !d.trackInventory ||
      d.itemType !== "STANDALONE" ||
      d.standaloneMode !== "existing" ||
      d.selectedInventoryId.length > 0,
    { message: "Select an inventory item", path: ["selectedInventoryId"] },
  )
  .refine(
    (d) =>
      !d.trackInventory ||
      d.itemType !== "STANDALONE" ||
      d.standaloneMode !== "new" ||
      d.newInventoryName.trim().length > 0,
    { message: "Inventory name is required", path: ["newInventoryName"] },
  )
  .refine(
    (d) =>
      !d.trackInventory ||
      d.itemType !== "STANDALONE" ||
      (d.standalonePrice != null && d.standalonePrice > 0),
    { message: "Price is required", path: ["standalonePrice"] },
  );

export type MenuFormInput = z.input<typeof MenuFormSchema>;
