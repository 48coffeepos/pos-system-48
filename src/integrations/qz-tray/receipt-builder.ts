import type { PosOrder } from "@/features/staff/pos/types";
import type { CashCountValues } from "@/features/staff/xreading/stores/useXReadingStore";
import type { DailyReconciliationTotals } from "@/features/staff/xreading/utils/reconciliation";
import {
  getExpectedCashInDrawer,
  getOverShort,
} from "@/features/staff/xreading/utils/reconciliation";
import qz from "qz-tray";
import { getQZPrinterName, isQZConnected } from "./client";
import * as escpos from "./escpos";

const MAX_CHARS = 42;
const DENOMINATIONS: number[] = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

function padEnd(s: string, len: number): string {
  return (s ?? "").padEnd(len, " ").slice(0, len);
}

function padStart(s: string, len: number): string {
  return (s ?? "").padStart(len, " ").slice(0, len);
}

function divider(char: string = "-"): string {
  return char.repeat(MAX_CHARS);
}

function textLine(left: string, right: string): string {
  return padEnd(left, 24) + padStart(right, 16);
}

function emitLine(parts: string[], text: string = ""): void {
  parts.push(text + escpos.LF);
}

/**
 * Builds an order slip receipt with embedded ESC/POS commands.
 */
export function buildOrderReceipt(
  order: PosOrder,
  cashierName: string,
): string {
  const p: string[] = [];

  p.push(escpos.init());
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  p.push(escpos.setCharSize(2, 2));
  emitLine(p, "48 COFFEE");
  p.push(escpos.setCharSize(1, 1));
  emitLine(p, "ORDER SLIP");
  p.push(escpos.setBold(false));
  emitLine(p);

  p.push(escpos.setAlign("left"));
  p.push(escpos.setBold(true));
  emitLine(p, `Order No. : ${order.order_id}`);
  emitLine(
    p,
    `Date : ${new Date(order.created_at).toLocaleDateString("en-GB")}`,
  );
  emitLine(
    p,
    `Time : ${new Date(order.created_at).toLocaleTimeString("en-US", {
      hour12: true,
    })}`,
  );
  p.push(escpos.setBold(false));
  emitLine(p);

  p.push(escpos.setBold(true));
  emitLine(p, "WALK-IN");
  p.push(escpos.setBold(false));
  emitLine(p, divider());

  p.push(escpos.setBold(true));
  emitLine(p, "Qty  Menu Description          Total Price");
  p.push(escpos.setBold(false));
  emitLine(p, divider());

  for (const item of order.items ?? []) {
    const qty = `${Math.round(item.quantity)}x`;
    const name = (item.snapshot_menu_name ?? "").slice(0, 15);
    const total = (item.line_total ?? 0).toFixed(2);
    const cupInfo =
      item.snapshot_inventory &&
      item.snapshot_inventory !== item.snapshot_menu_name
        ? item.snapshot_inventory.slice(0, 12)
        : "";

    emitLine(
      p,
      `${qty} ${padEnd(name, 15)} ${padEnd(cupInfo, 12)} ${padStart(total, 8)}`,
    );

    if (item.addon_items && item.addon_items.length > 0) {
      const addonText = item.addon_items
        .map((a) => `${a.addon_name_snapshot} x${a.quantity}`)
        .join(", ");
      emitLine(p, `  + ${addonText.slice(0, 36)}`);
    }
  }

  emitLine(p);
  emitLine(p, divider());

  const totalQty =
    order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  p.push(escpos.setBold(true));
  emitLine(p, textLine("Total Quantity :", `${totalQty}x`));
  emitLine(p, textLine("Total Paid Sales :", order.grand_total.toFixed(2)));
  p.push(escpos.setBold(false));

  const hasDiscount = order.items?.some(
    (i) => i.discount_type && i.discount_type !== "none",
  );
  const orderNote = order.note;

  if (hasDiscount || orderNote) {
    emitLine(p);
    emitLine(p, divider());
    if (hasDiscount) {
      for (const item of order.items ?? []) {
        if (item.discount_type && item.discount_type !== "none") {
          p.push(escpos.setBold(true));
          emitLine(p, `NAME: ${item.discount_contact ?? ""}`);
          emitLine(p, `ID NO: ${item.discount_id_number ?? ""}`);
          p.push(escpos.setBold(false));
        }
      }
    }
    if (orderNote) {
      p.push(escpos.setBold(true));
      emitLine(p, `NOTE: ${orderNote}`);
      p.push(escpos.setBold(false));
    }
  }

  emitLine(p);
  emitLine(p, divider());

  if (order.method !== "CASH") {
    p.push(escpos.setBold(true));
    emitLine(p, textLine("Payment Method :", order.method));
    if (order.reference_number) {
      emitLine(p, textLine("Reference No :", order.reference_number));
    }
    p.push(escpos.setBold(false));
  }

  if (order.method === "CASH") {
    p.push(escpos.setBold(true));
    emitLine(
      p,
      textLine("Amount PAID :", (order.amount_tendered ?? 0).toFixed(2)),
    );
    emitLine(
      p,
      textLine("CHANGE :", (order.change_amount ?? 0).toFixed(2)),
    );
    p.push(escpos.setBold(false));
  }

  if (hasDiscount) {
    emitLine(p);
    p.push(escpos.setAlign("left"));
    p.push(escpos.setBold(true));
    emitLine(p, "[X] SENIOR CITIZEN / PWD");
    p.push(escpos.setBold(false));
  }

  p.push(escpos.feed(4));
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  emitLine(p, divider());
  emitLine(p, "Signature");
  p.push(escpos.setBold(false));

  p.push(escpos.feed(3));
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  emitLine(p, cashierName.toUpperCase());
  p.push(escpos.setBold(false));
  emitLine(p, "Cashier's Name");

  p.push(escpos.feed(6));
  p.push(escpos.cut(true));

  return p.join("");
}

/**
 * Builds a Sales X-Reading receipt.
 */
export function buildSalesXReadingReceipt(
  staffName: string,
  totals: DailyReconciliationTotals,
  totalCashCounted: number,
): string {
  const { totalCashSales, totalCashOut, totalCashIn } = totals;
  const grossSales = totalCashSales + totalCashIn;
  const netSales = getExpectedCashInDrawer(totals);
  const { overShort } = getOverShort(totalCashCounted, totals);

  const p: string[] = [];

  p.push(escpos.init());
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  p.push(escpos.setCharSize(2, 2));
  emitLine(p, "48 COFFEE");
  p.push(escpos.setCharSize(1, 1));
  emitLine(p, "SALES X-READING");
  p.push(escpos.setBold(false));
  emitLine(p);

  p.push(escpos.setAlign("left"));
  const now = new Date();
  const displayDate = now.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  p.push(escpos.setBold(true));
  emitLine(p, textLine("Sales Date :", displayDate));
  emitLine(p, textLine("Cashier :", staffName));
  p.push(escpos.setBold(false));
  emitLine(p);

  emitLine(p, divider());
  emitLine(p);

  p.push(escpos.setBold(true));
  emitLine(p, textLine("TOTAL CASH IN:", totalCashIn.toFixed(2)));
  emitLine(p, textLine("TOTAL SALES:", totalCashSales.toFixed(2)));
  p.push(escpos.setBold(false));

  emitLine(p);
  emitLine(p, divider());
  emitLine(p);

  p.push(escpos.setBold(true));
  emitLine(p, textLine("GROSS SALES:", grossSales.toFixed(2)));
  emitLine(p, textLine("TOTAL PICKUP:", totalCashOut.toFixed(2)));
  p.push(escpos.setBold(false));

  emitLine(p);
  emitLine(p, divider());
  emitLine(p);

  p.push(escpos.setBold(true));
  emitLine(p, textLine("NET SALES:", netSales.toFixed(2)));
  emitLine(p, textLine("CASH COUNT:", totalCashCounted.toFixed(2)));
  const sign = overShort > 0 ? "+" : "";
  emitLine(p, textLine("OVER / SHORT:", `${sign}${overShort.toFixed(2)}`));
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  emitLine(p, divider());
  emitLine(p, "Signature of Cashier");
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.cut(true));

  return p.join("");
}

/**
 * Builds a Cash Count receipt.
 */
export function buildCashCountReceipt(
  staffName: string,
  cashCount: CashCountValues,
  totalCashCounted: number,
): string {
  const p: string[] = [];

  p.push(escpos.init());
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  p.push(escpos.setCharSize(2, 2));
  emitLine(p, "48 COFFEE");
  p.push(escpos.setCharSize(1, 1));
  emitLine(p, "CASH COUNT");
  p.push(escpos.setBold(false));

  const now = new Date();
  const displayDateTime = now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  emitLine(p, `Date: ${displayDateTime}`);
  emitLine(p, `Cashier: ${staffName}`);
  emitLine(p);

  p.push(escpos.setAlign("left"));
  emitLine(p, divider());

  for (const denom of DENOMINATIONS) {
    const qty = cashCount[denom as keyof CashCountValues] ?? 0;
    if (qty === 0) continue;
    const label = `PHP ${denom}`;
    const qtyStr = `x${qty}`;
    const amount = (denom * qty).toFixed(2);
    emitLine(p, `${padEnd(label, 12)} ${padEnd(qtyStr, 6)} ${padStart(amount, 10)}`);
  }

  emitLine(p, divider());
  p.push(escpos.setBold(true));
  emitLine(p, textLine("TOTAL:", totalCashCounted.toFixed(2)));
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  emitLine(p, divider());
  emitLine(p, "Signature of Cashier");
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.cut(true));

  return p.join("");
}

export interface CupSale {
  name: string;
  total: number;
  byMethod: Record<string, number>;
}

/**
 * Builds a Cups Sales receipt.
 */
export function buildCupsSalesReceipt(
  staffName: string,
  cupSales: CupSale[],
  periodLabel: string,
): string {
  const p: string[] = [];

  p.push(escpos.init());
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  p.push(escpos.setCharSize(2, 2));
  emitLine(p, "48 COFFEE");
  p.push(escpos.setCharSize(1, 1));
  emitLine(p, "CUPS SALES");
  p.push(escpos.setBold(false));
  emitLine(p);

  p.push(escpos.setAlign("left"));
  const now = new Date();
  const displayTime = now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  p.push(escpos.setBold(true));
  emitLine(p, textLine("Date :", periodLabel));
  emitLine(p, textLine("Time :", displayTime));
  emitLine(p, textLine("Cashier :", staffName));
  p.push(escpos.setBold(false));

  emitLine(p);
  emitLine(p, divider());

  const visibleCups = cupSales.filter((c) => c.total > 0);
  for (const cup of visibleCups) {
    emitLine(p);
    p.push(escpos.setBold(true));
    emitLine(p, textLine(cup.name, `${cup.total} cups`));
    p.push(escpos.setBold(false));
    emitLine(
      p,
      ` CASH:${cup.byMethod.CASH ?? 0}  GCASH:${cup.byMethod.GCASH ?? 0}  GRAB:${cup.byMethod.GRAB ?? 0}`,
    );
  }

  emitLine(p);
  emitLine(p, divider());
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
  p.push(escpos.setBold(true));
  emitLine(p, textLine("TOTAL CUPS SOLD :", `${totalCups} cups`));
  p.push(escpos.setBold(false));
  emitLine(
    p,
    `CASH:${totalCash}  GCASH:${totalGcash}  GRAB:${totalGrab}`,
  );

  p.push(escpos.feed(6));
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  emitLine(p, divider());
  emitLine(p, "Signature of Admin");
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.cut(true));

  return p.join("");
}

/**
 * Builds a Daily Revenue receipt.
 */
export function buildRevenueReceipt(
  staffName: string,
  cashRevenue: number,
  gcashRevenue: number,
  totalRevenue: number,
  periodLabel: string,
): string {
  const p: string[] = [];

  p.push(escpos.init());
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  p.push(escpos.setCharSize(2, 2));
  emitLine(p, "48 COFFEE");
  p.push(escpos.setCharSize(1, 1));
  emitLine(p, "DAILY REVENUE");
  p.push(escpos.setBold(false));
  emitLine(p);

  p.push(escpos.setAlign("left"));
  const now = new Date();
  const displayTime = now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  p.push(escpos.setBold(true));
  emitLine(p, textLine("Date :", periodLabel));
  emitLine(p, textLine("Time :", displayTime));
  emitLine(p, textLine("Cashier :", staffName));
  p.push(escpos.setBold(false));

  emitLine(p);
  emitLine(p, divider());
  emitLine(p);

  p.push(escpos.setBold(true));
  emitLine(p, textLine("CASH :", `PHP ${cashRevenue.toFixed(2)}`));
  emitLine(p, textLine("GCASH :", `PHP ${gcashRevenue.toFixed(2)}`));
  p.push(escpos.setBold(false));

  emitLine(p);
  emitLine(p, divider());
  emitLine(p);

  p.push(escpos.setBold(true));
  emitLine(p, textLine("TOTAL REVENUE :", `PHP ${totalRevenue.toFixed(2)}`));
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.setAlign("center"));
  p.push(escpos.setBold(true));
  emitLine(p, divider());
  emitLine(p, "Signature of Admin");
  p.push(escpos.setBold(false));

  p.push(escpos.feed(6));
  p.push(escpos.cut(true));

  return p.join("");
}

/**
 * Sends a built receipt string to the printer via QZ Tray.
 */
async function sendToQZTray(data: string): Promise<void> {
  if (!isQZConnected()) {
    throw new Error("QZ Tray is not connected");
  }

  const printerName = getQZPrinterName();
  if (!printerName) {
    throw new Error("No QZ Tray printer found");
  }

  const config = qz.configs.create(printerName, {
    encoding: "CP437",
  });

  await qz.print(config, [data]);
}

export async function printOrderReceiptQZ(
  order: PosOrder,
  cashierName: string,
): Promise<void> {
  const data = buildOrderReceipt(order, cashierName);
  await sendToQZTray(data);
}

export async function printSalesXReadingQZ(
  staffName: string,
  totals: DailyReconciliationTotals,
  totalCashCounted: number,
): Promise<void> {
  const data = buildSalesXReadingReceipt(staffName, totals, totalCashCounted);
  await sendToQZTray(data);
}

export async function printCashCountQZ(
  staffName: string,
  cashCount: CashCountValues,
  totalCashCounted: number,
): Promise<void> {
  const data = buildCashCountReceipt(staffName, cashCount, totalCashCounted);
  await sendToQZTray(data);
}

export async function printCupsSalesQZ(
  staffName: string,
  cupSales: CupSale[],
  periodLabel: string,
): Promise<void> {
  const data = buildCupsSalesReceipt(staffName, cupSales, periodLabel);
  await sendToQZTray(data);
}

export async function printRevenueQZ(
  staffName: string,
  cashRevenue: number,
  gcashRevenue: number,
  totalRevenue: number,
  periodLabel: string,
): Promise<void> {
  const data = buildRevenueReceipt(
    staffName,
    cashRevenue,
    gcashRevenue,
    totalRevenue,
    periodLabel,
  );
  await sendToQZTray(data);
}
