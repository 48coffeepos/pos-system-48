export const DEFAULT_TIMEZONE = "Asia/Manila";

function getDateStr(tz: string, date: Date): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: tz,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

function getUtcOffset(tz: string, date: Date): string {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: tz,
		timeZoneName: "longOffset",
	}).formatToParts(date);

	const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

	const match = tzName.match(/(?:UTC|GMT)([+-]\d{1,2}):?(\d{2})?/);

	if (!match) {
		return "+00:00";
	}

	const absH = String(Math.abs(Number(match[1])));
	const min = String(match[2] ?? "0").padStart(2, "0");
	const sign = Number(match[1]) >= 0 ? "+" : "-";

	return `${sign}${absH.padStart(2, "0")}:${min}`;
}

function boundsForDate(tz: string, date: Date) {
	const dateStr = getDateStr(tz, date);
	const offset = getUtcOffset(tz, date);

	return {
		start: new Date(`${dateStr}T00:00:00${offset}`),
		end: new Date(`${dateStr}T23:59:59.999${offset}`),
	};
}

export function getTimeframeBounds(
	timeframe: "today" | "yesterday",
	tz: string = process.env.TIMEZONE ?? DEFAULT_TIMEZONE,
) {
	const now = new Date();

	if (timeframe === "today") {
		return boundsForDate(tz, now);
	}

	const yesterday = new Date(now.getTime() - 86_400_000);
	return boundsForDate(tz, yesterday);
}

export function getTodayBounds(tz?: string) {
	return getTimeframeBounds("today", tz);
}

export type OrderEditPolicy = "today" | "yesterday" | "historical";

export function getOrderEditPolicy(
	createdAt: Date,
	tz: string = process.env.TIMEZONE ?? DEFAULT_TIMEZONE,
): OrderEditPolicy {
	const orderDateStr = getDateStr(tz, createdAt);
	const todayStr = getDateStr(tz, new Date());
	if (orderDateStr === todayStr) return "today";

	const yesterday = new Date(Date.now() - 86_400_000);
	const yesterdayStr = getDateStr(tz, yesterday);
	if (orderDateStr === yesterdayStr) return "yesterday";

	return "historical";
}
