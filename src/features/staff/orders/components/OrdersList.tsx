import { useState, useCallback } from "react";
import { Receipt, CreditCard } from "@phosphor-icons/react";
import { formatPeso } from "@/lib/format-currency";
import { PosReceiptDialog } from "@/features/staff/pos/components/PosReceiptDialog";
import type { PosOrder } from "@/features/staff/pos/types";

interface DBOrder {
  order_id: string;
  method: string;
  reference_number: string | null;
  paid: number | null;
  change: number | null;
  total: number;
  created_at: string | Date;
  order_items: Array<{
    id: number;
    menu_id: number;
    name: string;
    discount: string | null;
    quantity: number;
    discount_name: string | null;
    discount_id: string | null;
    subtotal: number;
    total: number;
    note: string | null;
    cup_type: string | null;
    cup_size: string | null;
    addon_items: Array<{
      id: number;
      addon_id: number;
      quantity: number;
      addon: {
        id: number;
        name: string;
        price: number;
      };
    }>;
  }>;
}

interface OrdersListProps {
  orders: DBOrder[];
}

export function OrdersList({ orders = [] }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
  const [timeframe, setTimeframe] = useState<"today" | "yesterday">("today");

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const todayStr = new Date().toDateString();
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    const orderDateStr = orderDate.toDateString();

    if (timeframe === "today") {
      return orderDateStr === todayStr;
    }
    return orderDateStr === yesterdayStr;
  });

  const viewReceipt = (order: DBOrder) => {
    const mapped: PosOrder = {
      order_number: order.order_id,
      created_at: new Date(order.created_at).toISOString(),
      method: order.method,
      reference_number: order.reference_number || undefined,
      paid: order.paid !== null ? order.paid : undefined,
      change: order.change !== null ? order.change : undefined,
      total: order.total,
      items: order.order_items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: item.subtotal / (item.quantity || 1),
        discount: item.discount || undefined,
        discount_name: item.discount_name || undefined,
        discount_id: item.discount_id || undefined,
        subtotal: item.subtotal,
        total: item.total,
        note: item.note || undefined,
        cup_type: item.cup_type || undefined,
        cup_size: item.cup_size || undefined,
        addon_items: item.addon_items.map((ai) => ({
          addon_id: ai.addon_id,
          name: ai.addon.name,
          price: ai.addon.price,
          quantity: ai.quantity,
        })),
      })),
    };
    setSelectedOrder(mapped);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "CASH":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "GCASH":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "GRAB":
        return "bg-orange-50 text-orange-700 border-orange-200/50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-(--deep-forest)">Recent Transactions</h2>
            <p className="text-xs text-(--medium-gray) mt-0.5">
              A real-time list of all placed orders
            </p>
          </div>

          {/* Timeframe Pill Switcher */}
          <div className="flex self-start gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
            <button
              type="button"
              onClick={() => setTimeframe("today")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                timeframe === "today"
                  ? "bg-(--deep-forest) text-white shadow-sm"
                  : "text-(--medium-gray) hover:bg-(--light-gray)/50"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("yesterday")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                timeframe === "yesterday"
                  ? "bg-(--deep-forest) text-white shadow-sm"
                  : "text-(--medium-gray) hover:bg-(--light-gray)/50"
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-(--light-gray)/40">
          <table className="w-full border-collapse text-left table-fixed">
            <thead>
              <tr className="border-b border-(--light-gray)/40 bg-(--off-white) text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                <th className="p-4 pl-6 w-[20%]">Order No</th>
                <th className="p-4 w-[20%]">Date & Time</th>
                <th className="p-4 w-[20%]">Payment</th>
                <th className="p-4 w-[20%]">Total</th>
                <th className="p-4 pr-6 no-print w-[20%]">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--light-gray)/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm font-medium text-(--medium-gray)">
                    No transactions found for {timeframe === "today" ? "today" : "yesterday"}.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const dateObj = new Date(order.created_at);
                  const formattedDate = dateObj.toLocaleDateString("en-GB");
                  const formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <tr
                      key={order.order_id}
                      className="group hover:bg-(--off-white)/50 transition-colors"
                    >
                      {/* Order Number */}
                      <td className="p-4 pl-6 font-mono font-bold text-sm text-(--near-black)">
                        {order.order_id}
                      </td>

                      {/* Date and Time */}
                      <td className="p-4 text-xs font-medium text-(--near-black)">
                        <div className="flex flex-col gap-0.5">
                          <span>{formattedDate}</span>
                          <span className="text-(--medium-gray)">{formattedTime}</span>
                        </div>
                      </td>

                      {/* Payment Method & details */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getMethodBadgeClass(
                              order.method
                            )}`}
                          >
                            <CreditCard className="size-3" />
                            {order.method}
                          </span>
                          {order.reference_number && order.method !== "GCASH" && (
                            <span className="text-[10px] font-mono text-(--medium-gray)">
                              Ref: {order.reference_number}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="p-4 font-black text-sm text-(--near-black)">
                        {formatPeso(order.total)}
                      </td>

                      {/* Action Button */}
                      <td className="p-4 pr-6 no-print">
                        <button
                          onClick={() => viewReceipt(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-xs font-bold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
                        >
                          <Receipt className="size-3.5" />
                          View Slip
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PosReceiptDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPrint={handlePrint}
        cashierName="Cashier"
      />
    </div>
  );
}
