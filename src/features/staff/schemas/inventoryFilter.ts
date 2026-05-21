import { z } from "zod";

export const inventoryFilterSchema = z.object({
	timeframe: z.enum(["today", "yesterday"]),
	search: z.string(),
});

export type InventoryFilterValues = z.infer<typeof inventoryFilterSchema>;

export const defaultInventoryFilterValues = (): InventoryFilterValues => ({
	timeframe: "today",
	search: "",
});
