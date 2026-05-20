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
): string {
	return `${itemId}-${cupType}-${cupSize}${addonKey ? `-${addonKey}` : ""}`;
}

export function getCupSizes(ozList: number[] | undefined | null): Array<{ key: string; label: string; ounces: number }> {
	return (ozList ?? []).map((oz) => ({
		key: oz === 12 ? "12OZ" : "16OZ",
		label: oz === 12 ? "12oz" : "16oz",
		ounces: oz,
	}));
}
