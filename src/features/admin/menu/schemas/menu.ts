import { z } from "zod";

export const MenuFormSchema = z
  .object({
    mode: z.union([z.literal("create"), z.literal("edit")]),
    menuId: z.string().optional(),
    name: z.string().trim().min(1, "Name is required"),
    trackInventory: z.boolean(),
    price: z.number().optional(),
    itemType: z.enum(["CUP", "STANDALONE", "SUPPLIES"]).optional(),
    selectedCupIds: z.array(z.string()),
    cupPrices: z.record(z.string(), z.number()),
    standaloneMode: z.enum(["existing", "new"]).optional(),
    selectedInventoryId: z.string(),
    newInventoryName: z.string(),
    standalonePrice: z.number().optional(),
  })
  .superRefine((d, ctx) => {
    // 1. Non-tracked items need a price
    if (!d.trackInventory) {
      if (d.price == null || d.price <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Price is required",
          path: ["price"],
        });
      }
      return;
    }

    // 2. Tracked items must have an itemType
    if (!d.itemType) {
      ctx.addIssue({
        code: "custom",
        message: "Item type is required",
        path: ["itemType"],
      });
      return;
    }

    // 3. CUP validations
    if (d.itemType === "CUP") {
      if (d.selectedCupIds.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Select at least one cup size",
          path: ["selectedCupIds"],
        });
      } else {
        const missingPrices = d.selectedCupIds.filter(
          (id) => (d.cupPrices[id] ?? 0) <= 0,
        );
        if (missingPrices.length > 0) {
          ctx.addIssue({
            code: "custom",
            message: "All selected cups need a price",
            path: ["cupPrices"],
          });
        }
      }
      return;
    }

    // 4. STANDALONE validations
    if (d.itemType === "STANDALONE") {
      if (!d.standaloneMode) {
        ctx.addIssue({
          code: "custom",
          message: "Select a standalone mode",
          path: ["standaloneMode"],
        });
        return;
      }

      if (d.standaloneMode === "existing") {
        if (d.selectedInventoryId.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Select an inventory item",
            path: ["selectedInventoryId"],
          });
        }
      }

      if (d.standaloneMode === "new") {
        if (d.newInventoryName.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Inventory name is required",
            path: ["newInventoryName"],
          });
        }
      }

      if (d.standalonePrice == null || d.standalonePrice <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Price is required",
          path: ["standalonePrice"],
        });
      }
    }
  });

export type MenuFormInput = z.input<typeof MenuFormSchema>;
