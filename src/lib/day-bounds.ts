/** Local calendar-day bounds for "today" and "yesterday" queries. */
export function getTimeframeBounds(timeframe: "today" | "yesterday") {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const date = now.getDate();

	if (timeframe === "today") {
		return {
			start: new Date(year, month, date, 0, 0, 0, 0),
			end: new Date(year, month, date, 23, 59, 59, 999),
		};
	}

	return {
		start: new Date(year, month, date - 1, 0, 0, 0, 0),
		end: new Date(year, month, date - 1, 23, 59, 59, 999),
	};
}

export function getTodayBounds() {
	return getTimeframeBounds("today");
}
