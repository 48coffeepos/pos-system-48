import type { PosOrder } from "@/features/staff/pos/types";
import * as escpos from "./escpos";

const MAX_CHARS = 42;

function padEnd(s: string, len: number): number[] {
  return escpos.text((s ?? "").padEnd(len, " ").slice(0, len));
}

function padStart(s: string, len: number): number[] {
  return escpos.text((s ?? "").padStart(len, " ").slice(0, len));
}

function divider(): number[] {
  return [...escpos.textLine("-".repeat(MAX_CHARS))];
}

function textLine(left: string, right: string): number[] {
  return [
    ...padEnd(left, 24),
    ...padStart(right.toUpperCase(), 16),
    escpos.LF,
  ];
}

function emitLine(str: string): number[] {
  return escpos.textLine(str);
}

function buildOrderReceiptBytes(order: PosOrder, cashierName: string): number[] {
  const b: number[] = [];

  const push = (bytes: number[]) => b.push(...bytes);
  const pushBold = (on: boolean) => push(escpos.setBold(on));

  push(escpos.init());
  push(escpos.setAlign("center"));
  pushBold(true);
  push(escpos.setCharSize(2, 2));
  push(emitLine("48 COFFEE"));
  push(escpos.setCharSize(1, 1));
  push(emitLine("ORDER SLIP"));
  pushBold(false);
  push(emitLine(""));

  push(escpos.setAlign("left"));
  pushBold(true);
  push(emitLine(`Order No. : ${order.order_id}`));
  push(emitLine(`Date : ${new Date(order.created_at).toLocaleDateString("en-GB")}`));
  push(emitLine(`Time : ${new Date(order.created_at).toLocaleTimeString("en-US", { hour12: true })}`));
  pushBold(false);
  push(emitLine(""));

  pushBold(true);
  push(emitLine("WALK-IN"));
  pushBold(false);
  push(divider());

  pushBold(true);
  push(emitLine("Qty  Menu Description          Total Price"));
  pushBold(false);
  push(divider());

  for (const item of order.items ?? []) {
    const qty = `${Math.round(item.quantity)}x`;
    const name = (item.snapshot_menu_name ?? "").slice(0, 15);
    const total = (item.line_total ?? 0).toFixed(2);
    const cupInfo = item.snapshot_inventory &&
      item.snapshot_inventory !== item.snapshot_menu_name
        ? item.snapshot_inventory.slice(0, 12)
        : "";

    push(emitLine(`${qty} ${padEndStr(name, 15)} ${padEndStr(cupInfo, 12)} ${padStartStr(total, 8)}`));

    if (item.addon_items && item.addon_items.length > 0) {
      const addonText = item.addon_items
        .map((a) => `${a.addon_name_snapshot} x${a.quantity}`)
        .join(", ");
      push(emitLine(`  + ${addonText.slice(0, 36)}`));
    }
  }

  push(emitLine(""));
  push(divider());

  const totalQty = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  pushBold(true);
  push(textLine("Total Quantity :", `${totalQty}x`));
  push(textLine("Total Paid Sales :", order.grand_total.toFixed(2)));
  pushBold(false);

  const hasDiscount = order.items?.some((i) => i.discount_type && i.discount_type !== "none");
  const orderNote = order.note;

  if (hasDiscount || orderNote) {
    push(emitLine(""));
    push(divider());
    if (hasDiscount) {
      for (const item of order.items ?? []) {
        if (item.discount_type && item.discount_type !== "none") {
          pushBold(true);
          push(emitLine(`NAME: ${item.discount_contact ?? ""}`));
          push(emitLine(`ID NO: ${item.discount_id_number ?? ""}`));
          pushBold(false);
        }
      }
    }
    if (orderNote) {
      pushBold(true);
      push(emitLine(`NOTE: ${orderNote}`));
      pushBold(false);
    }
  }

  push(emitLine(""));
  push(divider());

  if (order.method !== "CASH") {
    pushBold(true);
    push(textLine("Payment Method :", order.method));
    if (order.reference_number) {
      push(textLine("Reference No :", order.reference_number));
    }
    pushBold(false);
  }

  if (order.method === "CASH") {
    pushBold(true);
    push(textLine("Amount PAID :", (order.amount_tendered ?? 0).toFixed(2)));
    push(textLine("CHANGE :", (order.change_amount ?? 0).toFixed(2)));
    pushBold(false);
  }

  if (hasDiscount) {
    push(emitLine(""));
    push(escpos.setAlign("left"));
    pushBold(true);
    push(emitLine("[X] SENIOR CITIZEN / PWD"));
    pushBold(false);
  }

  push(escpos.feed(4));
  push(escpos.setAlign("center"));
  pushBold(true);
  push(divider());
  push(emitLine("Signature"));
  pushBold(false);

  push(escpos.feed(3));
  push(escpos.setAlign("center"));
  pushBold(true);
  push(emitLine(cashierName.toUpperCase()));
  pushBold(false);
  push(emitLine("Cashier's Name"));

  push(escpos.feed(6));
  push(escpos.cut(true));

  return b;
}

function padEndStr(s: string, len: number): string {
  return (s ?? "").padEnd(len, " ").slice(0, len);
}

function padStartStr(s: string, len: number): string {
  return (s ?? "").padStart(len, " ").slice(0, len);
}

export function buildOrderReceiptBytes2(order: PosOrder, cashierName: string): Uint8Array {
  return new Uint8Array(buildOrderReceiptBytes(order, cashierName));
}
