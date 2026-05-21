import { z } from "zod";

export const ordersFilterSchema = z.object({
	timeframe: z.enum(["today", "yesterday"]),
});

export type OrdersFilterValues = z.infer<typeof ordersFilterSchema>;

export const defaultOrdersFilterValues = (): OrdersFilterValues => ({
	timeframe: "today",
});
