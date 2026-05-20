import { Inventory_Type } from "@/generated/prisma/enums.js";

export interface MenuItem {
	id: number;
	name: string;
	price: number | null;
	category: string;
	type: Inventory_Type | null;
	inventory_items: Array<{
		price: number;
		inventory: {
			inventory_id: string;
			name: string;
			stock: number;
			type: Inventory_Type;
		};
	}>;
}

export interface CartItem {
	lineKey: string;
	menu_item_id: number;
	menu_name: string;
	category: string;
	quantity: number;
	cup_type: string;
	cup_size: string;
	addon_items?: Array<{ addon_id: number; name: string; price: number; quantity: number }>;
	unit_price: number;
	total_price: number;
	discount?: string;
	discount_name?: string;
	discount_id?: string;
	is_free_drink?: boolean;
}

export interface PosOrder {
	order_number: string;
	created_at: string;
	method: string;
	reference_number?: string;
	paid?: number;
	change?: number;
	total: number;
	items: Array<{
		name: string;
		quantity: number;
		unit_price: number;
		discount?: string;
		discount_name?: string;
		discount_id?: string;
		subtotal: number;
		total: number;
		note?: string;
		cup_type?: string;
		cup_size?: string;
		addon_items?: Array<{ addon_id: number; name: string; price: number; quantity: number }>;
	}>;
}
