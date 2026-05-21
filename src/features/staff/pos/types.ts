import type {
	Discount_Type,
	Inventory_Type,
} from "@/generated/prisma/enums.js";

export interface MenuItem {
	menu_id: string;
	name: string;
	price: number | null;
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
	menu_id: string;
	menu_name: string;
	quantity: number;
	cup_type: string;
	cup_size: string;
	addon_items?: Array<{
		addon_id: string;
		name: string;
		price: number;
		quantity: number;
	}>;
	unit_price: number;
	total_price: number;
	discount?: Discount_Type;
	discount_name?: string;
	discount_id?: string;
	is_free_drink?: boolean;
}

export interface PosOrder {
	order_id: string;
	created_at: string;
	method: string;
	reference_number?: string;
	amount_tendered?: number;
	change_amount?: number;
	grand_total: number;
	note?: string;
	cashier_name?: string;
	items: Array<{
		snapshot_menu_name: string;
		quantity: number;
		unit_price: number;
		discount_type?: string;
		discount_contact?: string;
		discount_id_number?: string;
		line_total: number;
		note?: string;
		snapshot_inventory: string;
		addon_items?: Array<{
			addon_id: string;
			addon_name_snapshot: string;
			addon_price_snapshot: number;
			quantity: number;
		}>;
	}>;
}
