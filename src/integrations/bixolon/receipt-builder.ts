import type { PosOrder } from "@/features/staff/pos/types";
import type { CashCountValues } from "@/features/staff/xreading/stores/useXReadingStore";
import type { DailyReconciliationTotals } from "@/features/staff/xreading/utils/reconciliation";
import {
	getExpectedCashInDrawer,
	getOverShort,
} from "@/features/staff/xreading/utils/reconciliation";
import {
	BIXOLON_DEFAULT_SETTINGS,
	RECEIPT_BIXOLON_BOTTOM_FEED,
	RECEIPT_BIXOLON_TOP_FEED,
} from "./printer";
import type { BixolonConnectionConfig } from "./types";
import { getBixolonSDK, isBixolonSDKLoaded } from "./web-print-sdk";

type Denomination = number;

const DENOMINATIONS: Denomination[] = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

function t(
	data: string,
	opts: {
		bold?: boolean;
		dw?: boolean;
		dh?: boolean;
		uline?: boolean;
	} = {},
): void {
	const sdk = getBixolonSDK();
	if (!sdk) return;

	sdk.makeText({
		code: "page0",
		ics: "usa",
		font: "fonta",
		wd: opts.dw ? "2" : "0",
		ht: opts.dh ? "2" : "0",
		uline: opts.uline ? "true" : "false",
		bold: opts.bold ? "true" : "false",
		data,
	});
}

function align(pos: "left" | "center" | "right"): void {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makeAlign({ pos });
}

function feed(lines: number = 1): void {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makePaperFeed({ type: "line", value: String(lines) });
}

function cut(): void {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makePaperCut({ cuttype: "feed" });
}

function divider(char: string = "-"): void {
	t(char.repeat(42));
}

function blank(): void {
	t("");
}

function textLine(
	left: string,
	right: string,
	opts: { bold?: boolean } = {},
): void {
	const leftMax = 24;
	const rightMax = 16;
	const paddedLeft = left.padEnd(leftMax, " ").slice(0, leftMax);
	const paddedRight = right.padStart(rightMax, " ").slice(0, rightMax);
	t(paddedLeft + paddedRight, opts);
}

function beginReceipt(): void {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makeReinit();
	feed(RECEIPT_BIXOLON_TOP_FEED);
}

function finishReceipt(config?: Partial<BixolonConnectionConfig>): void {
	feed(RECEIPT_BIXOLON_BOTTOM_FEED);
	cut();
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.sendData(
		config?.ipAddr ?? BIXOLON_DEFAULT_SETTINGS.ipAddr,
		config?.shopID ?? BIXOLON_DEFAULT_SETTINGS.shopID,
		config?.devID ?? BIXOLON_DEFAULT_SETTINGS.devID,
	);
}

export function printOrderReceipt(
	order: PosOrder,
	cashierName: string,
	config?: Partial<BixolonConnectionConfig>,
): void {
	if (!isBixolonSDKLoaded()) return;
	if (!getBixolonSDK()) return;

	beginReceipt();

	align("center");
	t("48 COFFEE", { bold: true, dw: true, dh: true });
	t("Ledesma St., Iloilo City Proper,");
	t("Iloilo City, 5000");
	t("ORDER SLIP", { bold: true, dw: true, dh: true });
	blank();
	align("left");

	textLine("Order No. :", order.order_id, { bold: true });
	textLine("Date :", new Date(order.created_at).toLocaleDateString("en-GB"), {
		bold: true,
	});
	textLine(
		"Time :",
		new Date(order.created_at).toLocaleTimeString("en-US", {
			hour12: true,
		}),
		{ bold: true },
	);

	blank();
	t("WALK-IN", { bold: true });
	divider();

	t("Qty  Menu Description          Total Price", { bold: true });
	divider();

	for (const item of order.items ?? []) {
		const qty = String(Math.round(item.quantity));
		let combinedName = item.snapshot_menu_name ?? "";
		if (item.snapshot_inventory && item.snapshot_inventory !== item.snapshot_menu_name) {
			combinedName += ` ${item.snapshot_inventory}`;
		}

		const name = combinedName.slice(0, 20);
		const total = (item.line_total ?? 0).toFixed(2);
		t(`${qty}x   ${name.padEnd(20)}          ${total.padStart(8)}`, {
			bold: true,
			dh: true,
		});

		if (combinedName.length > 20) {
			t(`     ${combinedName.slice(20, 42)}`, { dh: true });
		}

		if (item.addon_items && item.addon_items.length > 0) {
			const addonText = item.addon_items
				.map((a) => `${a.addon_name_snapshot} x${a.quantity}`)
				.join(", ");
			let remaining = `+ ${addonText}`;
			while (remaining.length > 0) {
				t(`  ${remaining.slice(0, 36)}`);
				remaining = remaining.slice(36);
			}
		}
	}

	blank();
	divider();
	const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
	textLine("Total Quantity :", `${totalQty}x`, { bold: true });
	textLine("Total Paid Sales :", order.grand_total.toFixed(2), {
		bold: true,
	});

	const hasDiscount = order.items?.some(
		(i) => i.discount_type && i.discount_type !== "none",
	);
	const orderNote = order.note;

	if (hasDiscount || orderNote) {
		blank();
		divider();
		if (hasDiscount) {
			for (const item of order.items ?? []) {
				if (item.discount_type && item.discount_type !== "none") {
					t(`NAME: ${item.discount_contact ?? ""}`, { bold: true });
					t(`ID NO: ${item.discount_id_number ?? ""}`, { bold: true });
				}
			}
		}
		if (orderNote) {
			t(`NOTE: ${orderNote}`, { bold: true });
		}
	}

	blank();
	divider();
	if (order.method !== "CASH") {
		textLine("Payment Method :", order.method, { bold: true });
		if (order.reference_number) {
			textLine("Reference No :", order.reference_number, { bold: true });
		}
	}

	if (order.method === "CASH") {
		textLine("Amount PAID :", (order.amount_tendered ?? 0).toFixed(2), {
			bold: true,
		});
		textLine("CHANGE :", (order.change_amount ?? 0).toFixed(2), {
			bold: true,
		});
	}

	if (hasDiscount) {
		blank();
		align("left");
		t("[X] SENIOR CITIZEN / PWD", { bold: true });
	}

	feed(4);
	align("center");
	divider();
	t("Signature", { bold: true });

	feed(3);
	align("center");
	t(cashierName.toUpperCase(), { bold: true });
	t("Cashier's Name");

	finishReceipt(config);
}

export function printSalesXReading(
	staffName: string,
	totals: DailyReconciliationTotals,
	totalCashCounted: number,
	config?: Partial<BixolonConnectionConfig>,
): void {
	if (!isBixolonSDKLoaded()) return;
	if (!getBixolonSDK()) return;

	const { totalCashSales, totalCashOut, totalCashIn } = totals;
	const grossSales = totalCashSales + totalCashIn;
	const netSales = getExpectedCashInDrawer(totals);
	const { overShort } = getOverShort(totalCashCounted, totals);
	const now = new Date();
	const displayDate = now.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});

	beginReceipt();

	align("center");
	t("48 COFFEE", { bold: true, dw: true, dh: true });
	t("Ledesma St., Iloilo City Proper,");
	t("Iloilo City, 5000");
	t("SALES X-READING", { bold: true, dw: true, dh: true });
	blank();
	align("left");

	textLine("Sales Date :", displayDate, { bold: true });
	textLine("Cashier :", staffName, { bold: true });

	blank();
	divider();
	blank();

	textLine("TOTAL CASH IN:", totalCashIn.toFixed(2), { bold: true });
	textLine("TOTAL SALES:", totalCashSales.toFixed(2), { bold: true });

	blank();
	divider();
	blank();

	textLine("GROSS SALES:", grossSales.toFixed(2), { bold: true });
	textLine("TOTAL PICKUP:", totalCashOut.toFixed(2), { bold: true });

	blank();
	divider();
	blank();

	textLine("NET SALES:", netSales.toFixed(2), { bold: true });
	textLine("CASH COUNT:", totalCashCounted.toFixed(2), { bold: true });
	const sign = overShort > 0 ? "+" : "";
	textLine("OVER / SHORT:", `${sign}${overShort.toFixed(2)}`, {
		bold: true,
	});

	feed(6);
	align("center");
	divider();
	t("Signature of Cashier");

	finishReceipt(config);
}

export function printCashCount(
	staffName: string,
	cashCount: CashCountValues,
	totalCashCounted: number,
	config?: Partial<BixolonConnectionConfig>,
): void {
	if (!isBixolonSDKLoaded()) return;
	if (!getBixolonSDK()) return;

	const now = new Date();
	const displayDateTime = now.toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	beginReceipt();

	align("center");
	t("48 COFFEE", { bold: true, dw: true, dh: true });
	t("Ledesma St., Iloilo City Proper,");
	t("Iloilo City, 5000");
	t("CASH COUNT", { bold: true, dw: true, dh: true });
	t(`Date: ${displayDateTime}`);
	t(`Cashier: ${staffName}`);
	blank();
	align("left");

	divider();
	for (const denom of DENOMINATIONS) {
		const qty = cashCount[denom as keyof CashCountValues] ?? 0;
		if (qty === 0) continue;
		const label = `PHP ${denom}`;
		const qtyStr = `x${qty}`;
		const amount = (denom * qty).toFixed(2);
		t(`${label.padEnd(12)} ${qtyStr.padEnd(6)} ${amount.padStart(10)}`);
	}
	divider();

	textLine("TOTAL:", totalCashCounted.toFixed(2), { bold: true });

	feed(6);
	align("center");
	divider();
	t("Signature of Cashier");

	finishReceipt(config);
}

export interface CupSale {
	name: string;
	total: number;
	byMethod: Record<string, number>;
}

export function printCupsSales(
	staffName: string,
	cupSales: CupSale[],
	periodLabel: string,
	config?: Partial<BixolonConnectionConfig>,
): void {
	if (!isBixolonSDKLoaded()) return;
	if (!getBixolonSDK()) return;

	const now = new Date();
	const displayTime = now.toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	const visibleCups = cupSales.filter((c) => c.total > 0);
	const totalCups = visibleCups.reduce((sum, c) => sum + c.total, 0);
	const totalCash = visibleCups.reduce(
		(sum, c) => sum + (c.byMethod.CASH ?? 0),
		0,
	);
	const totalGcash = visibleCups.reduce(
		(sum, c) => sum + (c.byMethod.GCASH ?? 0),
		0,
	);
	const totalGrab = visibleCups.reduce(
		(sum, c) => sum + (c.byMethod.GRAB ?? 0),
		0,
	);

	beginReceipt();

	align("center");
	t("48 COFFEE", { bold: true, dw: true, dh: true });
	t("Ledesma St., Iloilo City Proper,");
	t("Iloilo City, 5000");
	t("CUPS SALES", { bold: true, dw: true, dh: true });
	blank();
	align("left");

	textLine("Date :", periodLabel, { bold: true });
	textLine("Time :", displayTime, { bold: true });
	textLine("Cashier :", staffName, { bold: true });

	blank();
	divider();

	for (const cup of visibleCups) {
		blank();
		textLine(cup.name, `${cup.total} cups`);
		t(
			` CASH:${cup.byMethod.CASH ?? 0}  GCASH:${cup.byMethod.GCASH ?? 0}  GRAB:${cup.byMethod.GRAB ?? 0}`,
		);
	}

	blank();
	divider();
	textLine("TOTAL CUPS SOLD :", `${totalCups} cups`, { bold: true });
	t(`CASH:${totalCash}  GCASH:${totalGcash}  GRAB:${totalGrab}`);

	feed(6);
	align("center");
	divider();
	t("Signature of Admin");

	finishReceipt(config);
}

export function printRevenue(
	staffName: string,
	cashRevenue: number,
	gcashRevenue: number,
	totalRevenue: number,
	periodLabel: string,
	config?: Partial<BixolonConnectionConfig>,
): void {
	if (!isBixolonSDKLoaded()) return;
	if (!getBixolonSDK()) return;

	const now = new Date();
	const displayTime = now.toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	beginReceipt();

	align("center");
	t("48 COFFEE", { bold: true, dw: true, dh: true });
	t("Ledesma St., Iloilo City Proper,");
	t("Iloilo City, 5000");
	t("DAILY REVENUE", { bold: true, dw: true, dh: true });
	blank();
	align("left");

	textLine("Date :", periodLabel, { bold: true });
	textLine("Time :", displayTime, { bold: true });
	textLine("Cashier :", staffName, { bold: true });

	blank();
	divider();
	blank();

	textLine("CASH :", `₱${cashRevenue.toFixed(2)}`, { bold: true });
	textLine("GCASH :", `₱${gcashRevenue.toFixed(2)}`, { bold: true });

	blank();
	divider();
	blank();

	textLine("TOTAL REVENUE :", `₱${totalRevenue.toFixed(2)}`, {
		bold: true,
	});

	feed(6);
	align("center");
	divider();
	t("Signature of Admin");

	finishReceipt(config);
}
