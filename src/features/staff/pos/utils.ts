export function formatCupLine(
	cup_type: string,
	cup_size: string,
): string | null {
	if (!cup_type || cup_type === "NONE" || !cup_size || cup_size === "NONE")
		return null;
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

export function parseCupInfo(name: string): {
	cup_type: string;
	cup_size: string;
} {
	const lower = name.toLowerCase();
	const cup_type = lower.includes("iced") ? "ICED" : "HOT";
	const cup_size = lower.includes("16oz") ? "16OZ" : "12OZ";
	return { cup_type, cup_size };
}
