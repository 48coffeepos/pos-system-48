import type { PaymentMethodFilter } from "../constants";

interface CupSale {
  name: string;
  total: number;
  byMethod: Record<string, number>;
}

interface CupSalesBreakdownProps {
  cupSales: CupSale[];
  selectedPayment: PaymentMethodFilter;
}

export function CupSalesBreakdown({
  cupSales,
  selectedPayment,
}: CupSalesBreakdownProps) {
  return (
    <div className="card-white p-5 mb-6">
      <h3 className="text-sm font-bold text-(--near-black) mb-4">
        Cups Sold Today
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cupSales.map((cup) => {
          const count =
            selectedPayment === "all"
              ? cup.total
              : (cup.byMethod[selectedPayment] ?? 0);

          return (
            <div
              key={cup.name}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-(--off-white) border border-(--light-gray)"
            >
              <span className="text-xs text-(--medium-gray) mb-1 text-center">
                {cup.name}
              </span>
              <span className="text-2xl font-bold text-(--deep-forest)">
                {count}
              </span>
              <span className="text-[10px] text-(--medium-gray)">sold</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
