import { useState } from "react";
import { Package } from "@phosphor-icons/react";

export interface InventoryItem {
  inventory_id: string;
  name: string;
  stock: number;
  yesterday_stock: number | null;
  type: "CUP" | "STANDALONE";
}

interface InventoryListProps {
  items?: InventoryItem[];
  title?: string;
  description?: string;
}

function InventoryList({ items = [], title, description }: InventoryListProps) {
  const [timeframe, setTimeframe] = useState<"today" | "yesterday">("today");
  const hasItems = items.length > 0;

  return (
    <div className="animate-fade-in-up">
      {hasItems ? (
        <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
          {/* Header Controls */}
          <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center ${title ? "sm:justify-between" : "sm:justify-end"}`}>
            {title && (
              <div>
                <h2 className="text-lg font-bold text-(--deep-forest)">
                  {title}
                </h2>
                {description && (
                  <p className="mt-0.5 text-xs text-(--medium-gray)">
                    {description}
                  </p>
                )}
              </div>
            )}
            {/* Timeframe Pill Switcher */}
            <div className="flex self-start gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
              <button
                type="button"
                onClick={() => setTimeframe("today")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${timeframe === "today"
                    ? "bg-(--deep-forest) text-white shadow-sm"
                    : "text-(--medium-gray) hover:bg-(--light-gray)/50"
                  }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("yesterday")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${timeframe === "yesterday"
                    ? "bg-(--deep-forest) text-white shadow-sm"
                    : "text-(--medium-gray) hover:bg-(--light-gray)/50"
                  }`}
              >
                Yesterday
              </button>
            </div>
          </div>

          {/* Structured Responsive Table */}
          <div className="w-full overflow-x-auto rounded-xl border border-(--light-gray)/40">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-(--light-gray)/40 bg-(--off-white) text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
                  <th className="p-4 pl-6">Item</th>
                  <th className="p-4 pr-6 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--light-gray)/40">
                {items.map((item) => (
                  <tr key={item.inventory_id} className="group hover:bg-(--off-white)/50 transition-colors">
                    {/* Column 1: Metadata Badge & Labels */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-sm text-(--near-black)">
                            {item.name}
                          </p>
                          <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mt-1 bg-amber-100 text-amber-800">
                            {item.type === "CUP" ? "Cup Size" : "Standalone"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Selected Timeframe Quantity Counter */}
                    <td className="p-4 pr-6 text-right font-bold text-sm text-(--near-black)">
                      {timeframe === "today"
                        ? item.stock
                        : item.yesterday_stock ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State Fallback Dropzone */
        <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12 text-center shadow-sm">
          <Package className="mx-auto size-16 text-(--medium-gray)/30" />
          <h2 className="mt-4 text-lg font-bold text-(--deep-forest)">
            No inventory items found
          </h2>
          <p className="mt-1 text-sm text-(--medium-gray)">
            Database seeder has not run yet.
          </p>
        </div>
      )}
    </div>
  );
}

export { InventoryList };
