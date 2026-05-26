import type { CartItem } from "../types";

export function snapshotInventoryLabel(
	c: Pick<CartItem, "cup_size" | "cup_type" | "menu_name">,
): string {
	if (c.cup_size === "CUSTOM") return c.cup_type;
	if (c.cup_type && c.cup_type !== "NONE") return `${c.cup_size} ${c.cup_type}`;
	return c.menu_name;
}

function mapAddonSnapshots(addonItems: CartItem["addon_items"]) {
	return addonItems?.map((a) => ({
		addon_id: a.addon_id,
		addon_name_snapshot: a.name,
		addon_price_snapshot: a.price,
		quantity: a.quantity,
	}));
}

export function cartItemToCreateOrderItem(c: CartItem) {
	const {
		lineKey: _lineKey,
		menu_name,
		total_price,
		discount,
		discount_name,
		discount_id,
		addon_items,
		...item
	} = c;

	return {
		...item,
		snapshot_menu_name: menu_name,
		snapshot_inventory: snapshotInventoryLabel(c),
		line_total: total_price,
		discount_type: discount,
		discount_contact: discount_name,
		discount_id_number: discount_id,
		is_free_drink: c.is_free_drink === true,
		addon_items: mapAddonSnapshots(addon_items),
	};
}

export function cartItemToPosOrderItem(c: CartItem) {
	const {
		lineKey: _lineKey,
		menu_name,
		total_price,
		discount,
		discount_name,
		discount_id,
		addon_items,
		quantity,
		unit_price,
	} = c;

	return {
		snapshot_menu_name: menu_name,
		quantity,
		unit_price,
		discount_type: discount,
		discount_contact: discount_name,
		discount_id_number: discount_id,
		line_total: total_price,
		snapshot_inventory: snapshotInventoryLabel(c),
		addon_items: mapAddonSnapshots(addon_items),
	};
}
