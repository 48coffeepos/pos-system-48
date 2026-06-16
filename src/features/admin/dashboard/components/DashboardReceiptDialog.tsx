import { PrinterIcon } from "@phosphor-icons/react";
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ReceiptThermalContent,
  THERMAL_PAGE_STYLE,
} from "@/integrations/bixolon";
import { formatReceiptDate, formatReceiptTime } from "@/lib/format-datetime";
import type { CupSale } from "../server/getAdminCupSales";

interface ReconciliationData {
  totalCashSales: number;
  totalGcashSales: number;
  totalGrabSales: number;
  totalCashOut: number;
  totalCashIn: number;
  totalExpenses: number;
}

interface DashboardReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "monthly" | "dailyRevenue" | "cups" | "xreading" | null;
  staffName: string;
  receiptDate?: "today" | "yesterday";
  monthlyData?: {
    totalRevenue: number;
    totalCashOut: number;
    totalCashIn: number;
    totalExpenses: number;
    totalSuppliesAmount: number;
    monthLabel: string;
    periodStart: string;
    periodEnd: string;
    orderCount: number;
    expenseCount: number;
    revenueByMethod: Record<string, number>;
  };
  dailyData?: {
    totalCashSales: number;
    totalGcashSales: number;
    totalRevenue: number;
  };
  cupSales?: CupSale[];
  reconciliation?: ReconciliationData;
}

function formatPeso(value: number) {
  return value.toFixed(2);
}

function formatTime(date: Date) {
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function DashboardReceiptDialog({
  open,
  onClose,
  mode,
  staffName,
  receiptDate = "today",
  monthlyData,
  dailyData,
  cupSales = [],
  reconciliation,
}: DashboardReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [grabAmount, setGrabAmount] = useState<string>("");
  const [payrollAmount, setPayrollAmount] = useState<string>("");
  const [otherExpenses, setOtherExpenses] = useState<{ id: string; name: string; amount: string }[]>([]);
  const [step, setStep] = useState<"form" | "receipt">("form");
  const [generatedAt, setGeneratedAt] = useState(() => new Date());

  useEffect(() => {
    if (open) {
      setGeneratedAt(new Date());
      setStep("form");
      setGrabAmount("");
      setPayrollAmount("");
      setOtherExpenses([]);
    }
  }, [open, mode]);

  const addOtherExpense = () => {
    setOtherExpenses([...otherExpenses, { id: Math.random().toString(36).slice(2), name: "", amount: "" }]);
  };

  const updateOtherExpense = (id: string, field: "name" | "amount", value: string) => {
    setOtherExpenses(
      otherExpenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeOtherExpense = (id: string) => {
    setOtherExpenses(otherExpenses.filter((exp) => exp.id !== id));
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: THERMAL_PAGE_STYLE,
    onAfterPrint: onClose,
  });

  if (!mode) return null;

  const targetDate = receiptDate === "yesterday"
    ? new Date(Date.now() - 86400000)
    : new Date();
  const displayDate = formatReceiptDate(targetDate);
  const displayTime = formatReceiptTime(targetDate);
  const generatedTime = formatReceiptTime(generatedAt);

  const showForm = mode === "monthly" || mode === "dailyRevenue";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent className="max-w-[360px] p-6">
        {showForm && step === "form" ? (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden pr-2">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-(--near-black)">
                {mode === "monthly" ? "Monthly Summary Receipt" : "Daily Sales Receipt"}
              </h2>
              <p className="text-xs text-(--medium-gray) mt-1">Please enter manual details before generating the receipt.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                  Manual Grab Sales
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-(--medium-gray)">
                    ₱
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={grabAmount}
                    onChange={(e) => setGrabAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex w-full h-10 rounded-xl border border-(--light-gray) bg-(--off-white) pl-8 pr-3 py-2 text-sm shadow-sm outline-none focus-visible:border-(--deep-forest)"
                  />
                </div>
              </div>

              {mode === "monthly" && (
                <>
                  <div className="border-t border-(--light-gray) pt-4 pb-2">
                    <h3 className="text-sm font-bold text-(--near-black) mb-3">Additional Expenses</h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold tracking-wider text-(--medium-gray)">
                          Payroll
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-(--medium-gray)">
                            ₱
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={payrollAmount}
                            onChange={(e) => setPayrollAmount(e.target.value)}
                            placeholder="0.00"
                            className="flex w-full h-10 rounded-xl border border-(--light-gray) bg-(--off-white) pl-8 pr-3 py-2 text-sm shadow-sm outline-none focus-visible:border-(--deep-forest)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-(--near-black)">Others</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addOtherExpense} className="h-8 text-xs">
                        + Add
                      </Button>
                    </div>
                    {otherExpenses.map((exp) => (
                      <div key={exp.id} className="flex gap-2 items-start">
                        <input
                          type="text"
                          value={exp.name}
                          onChange={(e) => updateOtherExpense(exp.id, "name", e.target.value)}
                          placeholder="Name"
                          className="flex w-1/2 h-10 rounded-xl border border-(--light-gray) bg-(--off-white) px-3 py-2 text-sm shadow-sm outline-none focus-visible:border-(--deep-forest)"
                        />
                        <div className="relative w-1/2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-(--medium-gray)">
                            ₱
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={exp.amount}
                            onChange={(e) => updateOtherExpense(exp.id, "amount", e.target.value)}
                            placeholder="0.00"
                            className="flex w-full h-10 rounded-xl border border-(--light-gray) bg-(--off-white) pl-8 pr-8 py-2 text-sm shadow-sm outline-none focus-visible:border-(--deep-forest)"
                          />
                          <button
                            type="button"
                            onClick={() => removeOtherExpense(exp.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-(--medium-gray) hover:text-red-500 font-bold"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => setStep("receipt")}
                className="flex-1 h-12 rounded-xl bg-(--deep-forest) text-white hover:bg-(--deep-forest)/90"
              >
                Generate Receipt
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ReceiptThermalContent ref={receiptRef}>
          {mode === "monthly" && monthlyData && (
            <div id="monthly-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
                <div className="text-xs font-bold leading-tight my-0.5">
                  <p>Ledesma St., Iloilo City Proper,</p>
                  <p>Iloilo City, 5000</p>
                </div>
                <h3 className="mt-0.5 text-sm font-bold uppercase">
                  MONTHLY SUMMARY
                </h3>
              </div>

              <div className="mb-3 space-y-0.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span>Period :</span>
                  <span>{monthlyData.monthLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{monthlyData.periodStart} - {monthlyData.periodEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Printed :</span>
                  <span>{formatTime(new Date())}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-black pt-2 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span>{monthlyData.orderCount}</span>
                </div>
              </div>

              <div className="mt-2 border-t border-dashed border-black pt-2 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span>CASH SALES:</span>
                  <span>₱{formatPeso(monthlyData.revenueByMethod?.CASH ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GCASH SALES:</span>
                  <span>₱{formatPeso(monthlyData.revenueByMethod?.GCASH ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GRAB SALES:</span>
                  <span>₱{formatPeso(Number.isNaN(parseFloat(grabAmount)) ? 0 : parseFloat(grabAmount || "0"))}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-black">
                  <div className="flex justify-between">
                    <span>TOTAL EXPENSES:</span>
                    <span>
                      ₱{formatPeso(
                        monthlyData.totalExpenses +
                        (monthlyData.totalSuppliesAmount ?? 0) +
                        (Number.isNaN(parseFloat(payrollAmount)) ? 0 : parseFloat(payrollAmount || "0")) +
                        otherExpenses.reduce((sum, exp) => sum + (Number.isNaN(parseFloat(exp.amount)) ? 0 : parseFloat(exp.amount || "0")), 0)
                      )}
                    </span>
                  </div>
                  <div className="pl-2 mt-1 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold">Pickup/Expenses:</span>
                      <span>₱{formatPeso(monthlyData.totalExpenses)}</span>
                    </div>
                    {(monthlyData.totalSuppliesAmount ?? 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="font-bold">Supplies:</span>
                        <span>₱{formatPeso(monthlyData.totalSuppliesAmount)}</span>
                      </div>
                    )}
                    {parseFloat(payrollAmount) > 0 && (
                      <div className="flex justify-between">
                        <span className="font-bold">Payroll:</span>
                        <span>₱{formatPeso(parseFloat(payrollAmount))}</span>
                      </div>
                    )}
                    {otherExpenses.map((exp) => (
                      parseFloat(exp.amount) > 0 && (
                        <div key={exp.id} className="flex justify-between">
                          <span className="font-bold truncate max-w-[120px]">{exp.name || "Other"}:</span>
                          <span>₱{formatPeso(parseFloat(exp.amount))}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-2 border-t border-dashed border-black pt-2 text-sm font-black">
                <div className="flex justify-between">
                  <span>TOTAL SALES:</span>
                  <span>
                    ₱{formatPeso(
                      ((monthlyData.revenueByMethod?.CASH ?? 0) +
                       (monthlyData.revenueByMethod?.GCASH ?? 0) +
                        (Number.isNaN(parseFloat(grabAmount)) ? 0 : parseFloat(grabAmount || "0"))) -
                      (monthlyData.totalExpenses +
                        (monthlyData.totalSuppliesAmount ?? 0) +
                        (Number.isNaN(parseFloat(payrollAmount)) ? 0 : parseFloat(payrollAmount || "0")) +
                        otherExpenses.reduce((sum, exp) => sum + (Number.isNaN(parseFloat(exp.amount)) ? 0 : parseFloat(exp.amount || "0")), 0))
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {mode === "dailyRevenue" && dailyData && (
            <div id="revenue-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
                <div className="text-xs font-bold leading-tight my-0.5">
                  <p>Ledesma St., Iloilo City Proper,</p>
                  <p>Iloilo City, 5000</p>
                </div>
                <h3 className="mt-0.5 text-sm font-bold uppercase">
                  DAILY SALES
                </h3>
              </div>

              <div className="mb-3 space-y-0.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{displayDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time :</span>
                  <span>{displayTime}</span>
                </div>
              </div>

              <div className="mb-2 border-t border-dashed border-black pt-2 text-xs font-bold">
                <div className="flex justify-between mb-1">
                  <span>CASH SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(dailyData.totalCashSales)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>GCASH SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(dailyData.totalGcashSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GRAB SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(Number.isNaN(parseFloat(grabAmount)) ? 0 : parseFloat(grabAmount || "0"))}</span>
                </div>
              </div>

              <div className="border-t border-black pt-2 text-sm font-black">
                <div className="flex justify-between">
                  <span>TOTAL SALES:</span>
                  <span className="tabular-nums">₱{formatPeso(dailyData.totalRevenue + (Number.isNaN(parseFloat(grabAmount)) ? 0 : parseFloat(grabAmount || "0")))}</span>
                </div>
              </div>
            </div>
          )}

          {mode === "cups" && (
            <div id="cups-sales-receipt">
              <div className="mb-3 text-center">
                <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
                <div className="text-xs font-bold leading-tight my-0.5">
                  <p>Ledesma St., Iloilo City Proper,</p>
                  <p>Iloilo City, 5000</p>
                </div>
                <h3 className="mt-0.5 text-sm font-bold uppercase">CUPS SALES</h3>
              </div>

              <div className="mb-3 space-y-0.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span>{displayDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time :</span>
                  <span>{displayTime}</span>
                </div>
              </div>

              <div className="mb-2 border-t border-dashed border-black pt-2">
                {cupSales
                  .filter((cup) => cup.total > 0)
                  .map((cup) => (
                    <div
                      key={cup.name}
                      className="mb-2 text-xs leading-tight font-bold"
                    >
                      <div className="flex justify-between font-bold uppercase">
                        <span>{cup.name}</span>
                        <span>{cup.total} cups</span>
                      </div>
                      <div className="mt-0.5 flex gap-2 text-[10px] opacity-90">
                        <span>CASH : {cup.byMethod.CASH ?? 0}</span>
                        <span>GCASH : {cup.byMethod.GCASH ?? 0}</span>
                        <span>GRAB : {cup.byMethod.GRAB ?? 0}</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="border-t border-dashed border-black pt-2 text-xs font-bold">
                <div className="mb-0.5 flex justify-between">
                  <span>TOTAL CUPS SOLD :</span>
                  <span>
                    {cupSales.reduce((sum, c) => sum + c.total, 0)} cups
                  </span>
                </div>
                <div className="flex gap-2 text-[10px]">
                  <span>
                    CASH :{" "}
                    {cupSales.reduce(
                      (sum, c) => sum + (c.byMethod.CASH ?? 0),
                      0,
                    )}
                  </span>
                  <span>
                    GCASH :{" "}
                    {cupSales.reduce(
                      (sum, c) => sum + (c.byMethod.GCASH ?? 0),
                      0,
                    )}
                  </span>
                  <span>
                    GRAB :{" "}
                    {cupSales.reduce(
                      (sum, c) => sum + (c.byMethod.GRAB ?? 0),
                      0,
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-12 text-center text-sm font-bold">
                <p className="border-t-2 border-dashed border-black pt-2">
                  Signature of Cashier
                </p>
              </div>
            </div>
          )}

          {mode === "xreading" && reconciliation && (
            <div id="xreading-receipt">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
                <div className="text-xs font-bold leading-tight my-1">
                  <p>Ledesma St., Iloilo City Proper,</p>
                  <p>Iloilo City, 5000</p>
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">
                  SALES X-READING
                </h3>
              </div>

              <div className="mb-4 text-sm font-bold">
                <div className="flex justify-between">
                  <span>Sales Date :</span>
                  <span>{displayDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Generated :</span>
                  <span>{generatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier :</span>
                  <span>{staffName}</span>
                </div>
              </div>

              <div className="mb-4 border-t-2 border-dashed border-black pt-4" />

              <div className="text-sm font-bold space-y-1">
                <div className="flex justify-between">
                  <span>TOTAL CASH IN:</span>
                  <span>{formatPeso(reconciliation.totalCashIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CASH SALES:</span>
                  <span>{formatPeso(reconciliation.totalCashSales)}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-dashed border-black pt-4 text-sm font-bold space-y-1">
                <div className="flex justify-between">
                  <span>GROSS SALES:</span>
                  <span>{formatPeso(reconciliation.totalCashSales + reconciliation.totalCashIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TOTAL PICKUP / EXPENSES:</span>
                  <span>{formatPeso(reconciliation.totalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TOTAL CASHOUT:</span>
                  <span>{formatPeso(reconciliation.totalCashOut)}</span>
                </div>
              </div>

              <div className="mt-4 border-t-2 border-dashed border-black pt-4 text-sm font-bold space-y-1">
                <div className="flex justify-between">
                  <span>NET SALES:</span>
                  <span>{formatPeso(
                    reconciliation.totalCashSales +
                    reconciliation.totalCashIn -
                    reconciliation.totalCashOut -
                    reconciliation.totalExpenses
                  )}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>GCASH SALES:</span>
                  <span>{formatPeso(reconciliation.totalGcashSales)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>GRAB SALES:</span>
                  <span>{formatPeso(reconciliation.totalGrabSales)}</span>
                </div>
              </div>

              <div className="mt-12 text-center text-sm font-bold">
                <p className="border-t-2 border-dashed border-black pt-2">
                  Signature of Cashier
                </p>
              </div>
            </div>
          )}

          {mode !== "cups" && mode !== "xreading" && (
            <>
              <div className="mt-8 border-t border-black pt-1 text-center">
                <span className="text-xs font-bold tracking-widest uppercase">
                  Signature
                </span>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs font-black uppercase">{staffName}</p>
                <p className="text-[9px] font-bold opacity-60">Admin&apos;s Name</p>
              </div>
            </>
          )}
          </ReceiptThermalContent>

          <div className="no-print mt-6 flex flex-col gap-3">
            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={onClose} className="flex-1 h-12">
                Close
              </Button>
              <Button
                onClick={() => handlePrint()}
                className="flex flex-1 h-12 gap-2"
              >
                <PrinterIcon className="size-4" /> Print
              </Button>
            </div>
          </div>
        </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
