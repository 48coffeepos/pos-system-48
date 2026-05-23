import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "@phosphor-icons/react";
import { PosModal } from "@/features/staff/pos/components/ui/PosModal";
import type { DailyReconciliationTotals } from "../utils/reconciliation";
import {
  getExpectedCashInDrawer,
  getOverShort,
} from "../utils/reconciliation";
import type { Denomination } from "./CashCountPanel";
import type { CashCountValues } from "../stores/useXReadingStore";
import {
  loadBixolonSDK,
  printSalesXReading,
  printCashCount,
  THERMAL_PAGE_STYLE,
} from "@/integrations/bixolon";

interface XReadingReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "sales" | "cashcount" | null;
  staffName: string;
  totals: DailyReconciliationTotals;
  totalCashCounted: number;
  cashCount: CashCountValues;
}

const denominations: Denomination[] = [
  1000, 500, 200, 100, 50, 20, 10, 5, 1,
];

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
  const [bixolonReady, setBixolonReady] = useState(false);
  const [bixolonLoading, setBixolonLoading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: THERMAL_PAGE_STYLE,
    onAfterPrint: onClose,
  });

  useEffect(() => {
    if (!open) return;

    setBixolonLoading(true);
    loadBixolonSDK()
      .then((loaded) => {
        setBixolonReady(loaded);
      })
      .catch(() => {
        setBixolonReady(false);
      })
      .finally(() => {
        setBixolonLoading(false);
      });
  }, [open]);

  const handleDirectPrint = () => {
    try {
      if (mode === "sales") {
        printSalesXReading(staffName, totals, totalCashCounted);
      } else if (mode === "cashcount") {
        printCashCount(staffName, cashCount, totalCashCounted);
      }
      onClose();
    } catch (err) {
      console.error("BIXOLON direct print failed:", err);
    }
  };

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
      <div
        ref={contentRef}
        id="receipt-content"
        className="receipt-thermal font-mono text-[#1a1a1a] select-none"
      >
        {mode === "sales" && (
          <div id="sales-xreading-receipt">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-black tracking-tight">48 COFFEE</h2>
              <h3 className="text-lg font-bold uppercase tracking-widest">
                SALES X-READING
              </h3>
            </div>

            <div className="mb-4 text-[11px] font-bold">
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

            <div className="text-[11px] font-bold space-y-1">
              <div className="flex justify-between">
                <span>TOTAL CASH IN:</span>
                <span>{totalCashIn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL SALES:</span>
                <span>{totalCashSales.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-dashed border-black pt-4 text-[11px] font-bold space-y-1">
              <div className="flex justify-between">
                <span>GROSS SALES:</span>
                <span>{grossSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL PICKUP:</span>
                <span>{totalCashOut.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 border-t-2 border-dashed border-black pt-4 text-[11px] font-bold space-y-1">
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

            <div className="mt-12 text-center text-[11px]">
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
              <h3 className="mt-0.5 text-lg font-bold uppercase">
                CASH COUNT
              </h3>
              <p className="text-sm mt-2">Date: {displayDateTime}</p>
              <p className="text-sm">Cashier: {staffName}</p>
            </div>

            <div className="mb-4 border-t border-dashed border-black pt-4">
              <table className="w-full text-sm">
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

            <div className="border-t border-dashed border-black pt-4 text-sm">
              <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>{totalCashCounted.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-12 text-center text-sm">
              <p className="border-t border-dashed border-black pt-2">
                Signature of Cashier
              </p>
            </div>
          </div>
        )}
      </div>

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
            <Printer className="size-4" /> Print
          </button>
        </div>
        {bixolonReady ? (
          <button
            type="button"
            onClick={handleDirectPrint}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 text-xs font-bold transition-all hover:bg-gray-50 active:scale-95"
            style={{
              borderColor: "var(--near-black)",
              color: "var(--near-black)",
            }}
          >
            <Printer className="size-3.5" /> Direct Print (BIXOLON)
          </button>
        ) : bixolonLoading ? (
          <button
            type="button"
            disabled
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 text-xs font-bold opacity-50 transition-all"
            style={{
              borderColor: "var(--near-black)",
              color: "var(--near-black)",
            }}
          >
            Detecting printer...
          </button>
        ) : null}
      </div>

      <style>{`
				.receipt-thermal {
					font-family: 'Courier New', Courier, monospace;
					line-height: 1.2;
				}
			`}</style>
    </PosModal>
  );
}
