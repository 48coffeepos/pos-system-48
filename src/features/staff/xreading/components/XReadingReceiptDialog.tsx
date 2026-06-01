import { PrinterIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PosModal } from "@/features/staff/pos/components/ui/PosModal";
import {
  ReceiptThermalContent,
  THERMAL_PAGE_STYLE,
} from "@/integrations/bixolon";
import type { CashCountValues } from "../stores/useXReadingStore";
import type { DailyReconciliationTotals } from "../utils/reconciliation";
import { getExpectedCashInDrawer, getOverShort } from "../utils/reconciliation";
import type { Denomination } from "./CashCountPanel";

interface XReadingReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "sales" | "cashcount" | null;
  staffName: string;
  totals: DailyReconciliationTotals;
  totalCashCounted: number;
  cashCount: CashCountValues;
}

const denominations: Denomination[] = [1000, 500, 200, 100, 50, 20, 10, 5, 1];

export function XReadingReceiptDialog({
  open,
  onClose,
  mode,
  staffName,
  totals,
  totalCashCounted,
  cashCount,
}: XReadingReceiptDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: THERMAL_PAGE_STYLE,
    onAfterPrint: onClose,
  });

  if (!mode) return null;

  const { totalCashSales, totalCashOut, totalCashIn } = totals;
  const grossSales = totalCashSales + totalCashIn;
  const netSales = getExpectedCashInDrawer(totals);
  const { overShort } = getOverShort(totalCashCounted, totals);

  const targetDate = new Date();

  const displayDate = targetDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const displayDateTime = targetDate.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <PosModal
      open={open}
      onClose={onClose}
      showClose
      className="max-w-[380px] p-4 sm:p-8"
      overlayClassName="overflow-y-auto no-print"
    >
      <ReceiptThermalContent ref={contentRef}>
        {mode === "sales" && (
          <div id="sales-xreading-receipt">
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
                <span>Cashier :</span>
                <span>{staffName}</span>
              </div>
            </div>

            <div className="mb-4 border-t-2 border-dashed border-black pt-4" />

            <div className="text-sm font-bold space-y-1">
              <div className="flex justify-between">
                <span>TOTAL CASH IN:</span>
                <span>{totalCashIn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL SALES:</span>
                <span>{totalCashSales.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-dashed border-black pt-4 text-sm font-bold space-y-1">
              <div className="flex justify-between">
                <span>GROSS SALES:</span>
                <span>{grossSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL PICKUP:</span>
                <span>{totalCashOut.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t-2 border-dashed border-black pt-4 text-sm font-bold space-y-1">
              <div className="flex justify-between">
                <span>NET SALES:</span>
                <span>{netSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>CASH COUNT:</span>
                <span>{totalCashCounted.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>OVER / SHORT:</span>
                <span>
                  {overShort > 0 ? "+" : ""}
                  {overShort.toFixed(2)}
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

        {mode === "cashcount" && (
          <div id="cash-count-receipt">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
              <div className="text-xs font-bold leading-tight my-1">
                <p>Ledesma St., Iloilo City Proper,</p>
                <p>Iloilo City, 5000</p>
              </div>
              <h3 className="mt-0.5 text-lg font-bold uppercase">CASH COUNT</h3>
              <p className="text-sm mt-2 font-bold">Date: {displayDateTime}</p>
              <p className="text-sm font-bold">Cashier: {staffName}</p>
            </div>

            <div className="mb-4 border-t border-dashed border-black pt-4">
              <table className="w-full text-sm font-bold">
                <tbody>
                  {denominations.map((denom) => {
                    const qty = cashCount[denom] || 0;
                    if (qty === 0) return null;
                    return (
                      <tr key={denom}>
                        <td className="py-1">₱{denom}</td>
                        <td className="py-1 text-center">x{qty}</td>
                        <td className="py-1 text-right">
                          {(denom * qty).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-dashed border-black pt-4 text-base">
              <div className="flex justify-between font-black">
                <span>TOTAL:</span>
                <span>{totalCashCounted.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-12 text-center text-sm font-bold">
              <p className="border-t border-dashed border-black pt-2">
                Signature of Cashier
              </p>
            </div>
          </div>
        )}
      </ReceiptThermalContent>

      <div className="no-print mt-8 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border-2 text-sm font-bold transition-all hover:bg-gray-50 active:scale-95"
            style={{
              borderColor: "var(--near-black)",
              color: "var(--near-black)",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => handlePrint()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--near-black)" }}
          >
            <PrinterIcon className="size-4" /> Print
          </button>
        </div>
      </div>
    </PosModal>
  );
}
