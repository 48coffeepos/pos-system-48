//#region node_modules/.nitro/vite/services/ssr/assets/pos-ui-Czx3k4Q7.js
var THERMAL_PAGE_STYLE = `
  @page {
    size: 80mm auto;
    margin: 0mm;
  }
  @media print {
    html, body {
      height: 100%;
      margin: 0 !important;
      padding: 0 !important;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;
var SDK_SCRIPTS = ["/sdk/bixolon/WS_parser.js", "/sdk/bixolon/bGateWebPrintAPI_WS.js"];
function getGlobalSDK() {
	try {
		const bGate = window.bGateWebPrintAPI;
		if (typeof bGate === "function") return new bGate();
		return null;
	} catch {
		return null;
	}
}
var sdkInstance = null;
var loaded = false;
var loading = false;
var loadPromise = null;
async function injectScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = false;
		script.onload = () => resolve();
		script.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load BIXOLON SDK script: ${src}`));
		document.head.appendChild(script);
	});
}
async function loadBixolonSDK() {
	if (loaded) return true;
	if (loading && loadPromise) return loadPromise;
	loading = true;
	loadPromise = (async () => {
		try {
			const existing = getGlobalSDK();
			if (existing) {
				sdkInstance = existing;
				loaded = true;
				return true;
			}
			for (const src of SDK_SCRIPTS) await injectScript(src);
			const instance = getGlobalSDK();
			if (instance) {
				sdkInstance = instance;
				loaded = true;
				return true;
			}
			return false;
		} catch {
			return false;
		} finally {
			loading = false;
			loadPromise = null;
		}
	})();
	return loadPromise;
}
function getBixolonSDK() {
	if (!loaded) return null;
	return sdkInstance;
}
function isBixolonSDKLoaded() {
	return loaded && sdkInstance !== null;
}
/**
* Net sales after cash in, cash sales, and cash out.
* Formula: Cash Sales + Cash In − Cash Out
*/
function getExpectedCashInDrawer({ totalCashSales, totalCashOut, totalCashIn }) {
	return totalCashSales + totalCashIn - totalCashOut;
}
/** Over = counted more than expected; short = counted less. */
function getOverShort(totalCashCounted, totals) {
	const expected = getExpectedCashInDrawer(totals);
	return {
		expectedCash: expected,
		overShort: totalCashCounted - expected
	};
}
function formatReconciliationStatus(overShort) {
	return {
		isMatched: Math.abs(overShort) < .01,
		isOver: overShort > .01,
		isShort: overShort < -.01
	};
}
var DENOMINATIONS = [
	1e3,
	500,
	200,
	100,
	50,
	20,
	10,
	5,
	1
];
function t(data, opts = {}) {
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
		data
	});
}
function align(pos) {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makeAlign({ pos });
}
function feed(lines = 1) {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makePaperFeed({
		type: "line",
		value: String(lines)
	});
}
function cut() {
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makePaperCut({ cuttype: "feed" });
}
function divider(char = "-") {
	t(char.repeat(42));
}
function blank() {
	t("");
}
function textLine(left, right, opts = {}) {
	const leftMax = 24;
	const rightMax = 16;
	t(left.padEnd(leftMax, " ").slice(0, leftMax) + right.padStart(rightMax, " ").slice(0, rightMax), opts);
}
function printOrderReceipt(order, cashierName, config) {
	if (!isBixolonSDKLoaded()) return;
	const sdk = getBixolonSDK();
	if (!sdk) return;
	sdk.makeReinit();
	align("center");
	t("48 COFFEE", {
		bold: true,
		dw: true,
		dh: true
	});
	t("ORDER SLIP", { bold: true });
	blank();
	align("left");
	textLine("Order No. :", order.order_id, { bold: true });
	textLine("Date :", new Date(order.created_at).toLocaleDateString("en-GB"), { bold: true });
	textLine("Time :", new Date(order.created_at).toLocaleTimeString("en-US", { hour12: true }), { bold: true });
	blank();
	t("WALK-IN", { bold: true });
	divider();
	t("Qty  Menu Description          Total Price", { bold: true });
	divider();
	for (const item of order.items ?? []) {
		const qty = String(Math.round(item.quantity));
		const name = (item.snapshot_menu_name ?? "").slice(0, 20);
		const total = (item.line_total ?? 0).toFixed(2);
		t(`${qty}x   ${name.padEnd(20)}          ${total.padStart(8)}`, { bold: true });
		if (item.snapshot_inventory && item.snapshot_inventory !== item.snapshot_menu_name) t(`     ${item.snapshot_inventory.slice(0, 22)}`);
		if (item.addon_items && item.addon_items.length > 0) t(`  + ${item.addon_items.map((a) => `${a.addon_name_snapshot} x${a.quantity}`).join(", ").slice(0, 36)}`);
	}
	blank();
	divider();
	textLine("Total Quantity :", `${order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}x`, { bold: true });
	textLine("Total Paid Sales :", order.grand_total.toFixed(2), { bold: true });
	const hasDiscount = order.items?.some((i) => i.discount_type && i.discount_type !== "none");
	const orderNote = order.note;
	if (hasDiscount || orderNote) {
		blank();
		divider();
		if (hasDiscount) {
			for (const item of order.items ?? []) if (item.discount_type && item.discount_type !== "none") {
				t(`NAME: ${item.discount_contact ?? ""}`, { bold: true });
				t(`ID NO: ${item.discount_id_number ?? ""}`, { bold: true });
			}
		}
		if (orderNote) t(`NOTE: ${orderNote}`, { bold: true });
	}
	blank();
	divider();
	if (order.method !== "CASH") {
		textLine("Payment Method :", order.method, { bold: true });
		if (order.reference_number) textLine("Reference No :", order.reference_number, { bold: true });
	}
	if (order.method === "CASH") {
		textLine("Amount PAID :", (order.amount_tendered ?? 0).toFixed(2), { bold: true });
		textLine("CHANGE :", (order.change_amount ?? 0).toFixed(2), { bold: true });
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
	feed(3);
	cut();
	sdk.sendData(config?.ipAddr ?? "127.0.0.1", config?.shopID ?? "BGATE_SAMPLE_SHOP", config?.devID ?? "local_printer");
}
function printSalesXReading(staffName, totals, totalCashCounted, config) {
	if (!isBixolonSDKLoaded()) return;
	const sdk = getBixolonSDK();
	if (!sdk) return;
	const { totalCashSales, totalCashOut, totalCashIn } = totals;
	const grossSales = totalCashSales + totalCashIn;
	const netSales = getExpectedCashInDrawer(totals);
	const { overShort } = getOverShort(totalCashCounted, totals);
	const displayDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric"
	});
	sdk.makeReinit();
	align("center");
	t("48 COFFEE", {
		bold: true,
		dw: true,
		dh: true
	});
	t("SALES X-READING", { bold: true });
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
	textLine("OVER / SHORT:", `${overShort > 0 ? "+" : ""}${overShort.toFixed(2)}`, { bold: true });
	feed(6);
	align("center");
	divider();
	t("Signature of Cashier");
	feed(3);
	cut();
	sdk.sendData(config?.ipAddr ?? "127.0.0.1", config?.shopID ?? "BGATE_SAMPLE_SHOP", config?.devID ?? "local_printer");
}
function printCashCount(staffName, cashCount, totalCashCounted, config) {
	if (!isBixolonSDKLoaded()) return;
	const sdk = getBixolonSDK();
	if (!sdk) return;
	const displayDateTime = (/* @__PURE__ */ new Date()).toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
	sdk.makeReinit();
	align("center");
	t("48 COFFEE", {
		bold: true,
		dw: true,
		dh: true
	});
	t("CASH COUNT", { bold: true });
	t(`Date: ${displayDateTime}`);
	t(`Cashier: ${staffName}`);
	blank();
	align("left");
	divider();
	for (const denom of DENOMINATIONS) {
		const qty = cashCount[denom] ?? 0;
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
	feed(3);
	cut();
	sdk.sendData(config?.ipAddr ?? "127.0.0.1", config?.shopID ?? "BGATE_SAMPLE_SHOP", config?.devID ?? "local_printer");
}
/** Shared POS UI classes aligned with the 48 Coffee palette (see src/styles/index.css). */
var posCard = "rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm";
var posBtnPrimary = "rounded-xl bg-(--deep-forest) text-(--pale-yellow) hover:bg-(--forest-green) disabled:opacity-50";
var posBtnSecondary = "rounded-xl border border-(--light-gray) bg-(--off-white) text-(--deep-forest) hover:bg-(--light-gray)/60";
var posBtnOutline = "rounded-xl border border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--forest-green) hover:text-(--deep-forest)";
var posBtnGhost = "rounded-xl text-(--medium-gray) hover:bg-(--off-white) hover:text-(--deep-forest)";
var posBadgeFree = "rounded-full bg-(--light-mint) px-2 py-0.5 text-[8px] font-bold text-(--deep-forest)";
var posBadgeDiscount = "rounded-full bg-(--soft-peach) px-2 py-0.5 text-[8px] font-bold text-(--coral)";
var posAddonSelected = "border-(--coral) bg-(--pale-yellow)";
var posAddonDefault = "border-(--light-gray) bg-(--off-white)";
var posMutedLabel = "text-xs font-bold tracking-wider uppercase text-(--medium-gray)";
var posSectionMuted = "rounded-xl bg-(--off-white)";
//#endregion
export { printCashCount as _, loadBixolonSDK as a, posBadgeDiscount as c, posBtnOutline as d, posBtnPrimary as f, posSectionMuted as g, posMutedLabel as h, getOverShort as i, posBadgeFree as l, posCard as m, formatReconciliationStatus as n, posAddonDefault as o, posBtnSecondary as p, getExpectedCashInDrawer as r, posAddonSelected as s, THERMAL_PAGE_STYLE as t, posBtnGhost as u, printOrderReceipt as v, printSalesXReading as y };
