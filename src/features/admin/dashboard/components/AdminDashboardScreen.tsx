import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TodayOrdersTable } from "@/features/admin/orders/components/TodayOrdersTable";
import { getTodayOrdersQueryOptions } from "@/features/admin/orders/queryOptions";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import type { PaymentMethodFilter } from "../constants";
import {
  getDashboardDataQueryOptions,
  getMonthlyDataQueryOptions,
  getAvailableMonthsQueryOptions,
} from "../queryOptions";
import { CupSalesBreakdown } from "./CupSalesBreakdown";
import { DashboardReceiptDialog } from "./DashboardReceiptDialog";
import { RevenueCard } from "./RevenueCard";

export function AdminDashboardScreen() {
  const { data } = useSuspenseQuery(getDashboardDataQueryOptions);
  const { data: session } = useSuspenseQuery(sessionQueryOptions);
  const { data: todayOrders } = useSuspenseQuery(getTodayOrdersQueryOptions);
  const { data: availableMonths } = useSuspenseQuery(getAvailableMonthsQueryOptions);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodFilter>("all");
  const [receiptMode, setReceiptMode] = useState<
    "select" | "monthly" | "monthPicker" | null
  >(null);

  const latest = availableMonths[0];
  const [selectedYear, setSelectedYear] = useState(latest?.year ?? new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(latest?.month ?? new Date().getMonth() + 1);

  const { data: monthlyData } = useQuery(
    getMonthlyDataQueryOptions(selectedYear, selectedMonth),
  );

  const { revenue, cupSales, periodLabel } = data;
  const staffName = session?.user?.name ?? "Admin";

  const handleOpenMonthPicker = () => {
    const latestMonth = availableMonths[0];
    if (latestMonth) {
      setSelectedYear(latestMonth.year);
      setSelectedMonth(latestMonth.month);
    }
    setReceiptMode("monthPicker");
  };

  const handleConfirmMonth = () => {
    setReceiptMode("monthly");
  };

  return (
    <div className="space-y-5">
      <RevenueCard
        revenueByMethod={revenue.byMethod}
        ordersByMethod={revenue.ordersByMethod}
        selectedPayment={selectedPayment}
        onPaymentChange={setSelectedPayment}
        periodLabel={periodLabel}
        onExportClick={() => setReceiptMode("select")}
      />

      <CupSalesBreakdown
        cupSales={cupSales}
        selectedPayment={selectedPayment}
      />

      <TodayOrdersTable data={todayOrders} limit={10} />

      <Dialog
        open={receiptMode === "select"}
        onOpenChange={(open) => {
          if (!open) setReceiptMode(null);
        }}
      >
        <DialogContent className="max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Print Receipt</DialogTitle>
            <DialogDescription>
              Print a monthly summary receipt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenMonthPicker}
              className="h-auto w-full rounded-xl border-(--light-gray) bg-(--off-white) px-4 py-2 text-xs font-semibold text-(--dark-gray) hover:bg-(--off-white)"
            >
              Monthly Summary Receipt
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setReceiptMode(null)}
              className="text-xs font-semibold text-(--dark-gray)"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={receiptMode === "monthPicker"}
        onOpenChange={(open) => {
          if (!open) setReceiptMode(null);
        }}
      >
        <DialogContent className="max-w-sm" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Select Month</DialogTitle>
            <DialogDescription>
              Choose the month for the summary receipt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {availableMonths.map((m) => (
              <Button
                key={`${m.year}-${m.month}`}
                type="button"
                variant={selectedYear === m.year && selectedMonth === m.month ? "default" : "outline"}
                onClick={() => {
                  setSelectedYear(m.year);
                  setSelectedMonth(m.month);
                }}
                className={`h-auto w-full rounded-xl px-4 py-3 text-xs font-semibold ${
                  selectedYear === m.year && selectedMonth === m.month
                    ? "bg-(--deep-forest) text-white hover:bg-(--deep-forest)/90"
                    : "border-(--light-gray) bg-(--off-white) text-(--dark-gray) hover:bg-(--off-white)"
                }`}
              >
                {m.label}
              </Button>
            ))}
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReceiptMode("select")}
              className="flex-1 rounded-xl px-4 py-3 text-xs font-semibold"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleConfirmMonth}
              className="flex-1 rounded-xl px-4 py-3 text-xs font-semibold text-white bg-(--deep-forest) hover:bg-(--deep-forest)/90"
            >
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardReceiptDialog
        open={receiptMode === "monthly"}
        onClose={() => setReceiptMode(null)}
        mode={receiptMode === "monthPicker" ? null : receiptMode}
        staffName={staffName}
        monthlyData={monthlyData}
      />
    </div>
  );
}
