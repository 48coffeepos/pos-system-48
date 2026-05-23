import { isBixolonSDKLoaded, getBixolonSDK } from "./web-print-sdk";
import type { BixolonConnectionConfig } from "./types";
import type { PosOrder } from "@/features/staff/pos/types";
import type { DailyReconciliationTotals } from "@/features/staff/xreading/utils/reconciliation";
import {
  getExpectedCashInDrawer,
  getOverShort,
} from "@/features/staff/xreading/utils/reconciliation";
import type { CashCountValues } from "@/features/staff/xreading/stores/useXReadingStore";

type Denomination = number;

const DENOMINATIONS: Denomination[] = [
  1000, 500, 200, 100, 50, 20, 10, 5, 1,
];

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

export function printOrderReceipt(
  order: PosOrder,
  cashierName: string,
  config?: Partial<BixolonConnectionConfig>,
): void {
  if (!isBixolonSDKLoaded()) return;

  const sdk = getBixolonSDK();
  if (!sdk) return;

  sdk.makeReinit();

  align("center");
  t("48 COFFEE", { bold: true, dw: true, dh: true });
  t("ORDER SLIP", { bold: true });
  blank();
  align("left");

  textLine("Order No. :", order.order_id, { bold: true });
  textLine(
    "Date :",
    new Date(order.created_at).toLocaleDateString("en-GB"),
    { bold: true },
  );
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
    const name = (item.snapshot_menu_name ?? "").slice(0, 20);
    const total = (item.line_total ?? 0).toFixed(2);
    t(`${qty}x   ${name.padEnd(20)}          ${total.padStart(8)}`, {
      bold: true,
    });

    if (
      item.snapshot_inventory &&
      item.snapshot_inventory !== item.snapshot_menu_name
    ) {
      t(`     ${item.snapshot_inventory.slice(0, 22)}`);
    }

    if (item.addon_items && item.addon_items.length > 0) {
      const addonText = item.addon_items
        .map((a) => `${a.addon_name_snapshot} x${a.quantity}`)
        .join(", ");
      t(`  + ${addonText.slice(0, 36)}`);
    }
  }

  blank();
  divider();
  const totalQty =
    order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
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

  feed(3);
  cut();

  sdk.sendData(
    config?.ipAddr ?? "127.0.0.1",
    config?.shopID ?? "BGATE_SAMPLE_SHOP",
    config?.devID ?? "local_printer",
  );
}

export function printSalesXReading(
  staffName: string,
  totals: DailyReconciliationTotals,
  totalCashCounted: number,
  config?: Partial<BixolonConnectionConfig>,
): void {
  if (!isBixolonSDKLoaded()) return;

  const sdk = getBixolonSDK();
  if (!sdk) return;

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

  sdk.makeReinit();

  align("center");
  t("48 COFFEE", { bold: true, dw: true, dh: true });
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
  const sign = overShort > 0 ? "+" : "";
  textLine("OVER / SHORT:", `${sign}${overShort.toFixed(2)}`, {
    bold: true,
  });

  feed(6);
  align("center");
  divider();
  t("Signature of Cashier");

  feed(3);
  cut();

  sdk.sendData(
    config?.ipAddr ?? "127.0.0.1",
    config?.shopID ?? "BGATE_SAMPLE_SHOP",
    config?.devID ?? "local_printer",
  );
}

export function printCashCount(
  staffName: string,
  cashCount: CashCountValues,
  totalCashCounted: number,
  config?: Partial<BixolonConnectionConfig>,
): void {
  if (!isBixolonSDKLoaded()) return;

  const sdk = getBixolonSDK();
  if (!sdk) return;

  const now = new Date();
  const displayDateTime = now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  sdk.makeReinit();

  align("center");
  t("48 COFFEE", { bold: true, dw: true, dh: true });
  t("CASH COUNT", { bold: true });
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
    t(
      `${label.padEnd(12)} ${qtyStr.padEnd(6)} ${amount.padStart(10)}`,
    );
  }
  divider();

  textLine("TOTAL:", totalCashCounted.toFixed(2), { bold: true });

  feed(6);
  align("center");
  divider();
  t("Signature of Cashier");

  feed(3);
  cut();

  sdk.sendData(
    config?.ipAddr ?? "127.0.0.1",
    config?.shopID ?? "BGATE_SAMPLE_SHOP",
    config?.devID ?? "local_printer",
  );
}
