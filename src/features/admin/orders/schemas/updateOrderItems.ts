import { z } from "zod";

export const updateOrderAddonSchema = z.object({
	addon_id: z.string(),
	addon_name_snapshot: z.string(),
	addon_price_snapshot: z.number(),
	quantity: z.number().int().min(1),
});

export const updateOrderItemSchema = z.object({
	order_item_id: z.string(),
	quantity: z.number().int().min(1),
	menu_id: z.string().optional(),
	snapshot_menu_name: z.string().optional(),
	snapshot_inventory: z.string().optional(),
	unit_price: z.number().optional(),
	line_total: z.number().optional(),
	loyalty: z.boolean().optional(),
	discount_type: z.enum(["PWD", "SENIOR"]).nullable().optional(),
	discount_contact: z.string().nullable().optional(),
	discount_id_number: z.string().nullable().optional(),
	addon_items: z.array(updateOrderAddonSchema).optional(),
});

export const updateOrderItemsInput = z.object({
	orderId: z.string(),
	items: z.array(updateOrderItemSchema).min(1, "Order must have at least one item"),
});
