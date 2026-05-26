export function formatCupLine(
	cup_type: string,
	cup_size: string,
): string | null {
	if (!cup_type || cup_type === "NONE" || !cup_size || cup_size === "NONE")
		return null;
	if (cup_size === "CUSTOM") return cup_type;
	const t = cup_type === "HOT" ? "Hot" : "Iced";
	return `${t} · ${cup_size}`;
}

export function cartLineKey(
	itemId: string,
	cupType: string,
	cupSize: string,
	addonKey?: string,
	isFreeDrink?: boolean,
	discountType?: string,
): string {
	let key = `${itemId}-${cupType}-${cupSize}${addonKey ? `-${addonKey}` : ""}`;
	if (isFreeDrink) key += "-FREE";
	if (discountType && discountType !== "none") key += `-${discountType}`;
	return key;
}

export { parseCupInfo } from "@/lib/cup-utils";
export { seniorPwdDiscountAmount, SENIOR_PWD_DISCOUNT_PERCENT } from "./order-discount";
export {
	cartItemToCreateOrderItem,
	cartItemToPosOrderItem,
	snapshotInventoryLabel,
} from "./cart-order";
