export function formatReceiptDate(date: Date) {
	return date.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
}

export function formatReceiptTime(date: Date) {
	return date.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}
