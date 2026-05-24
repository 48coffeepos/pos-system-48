import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { getFilteredOrdersQueryOptions } from "@/features/admin/orders/queryOptions";
import { TodayOrdersTable } from "./TodayOrdersTable";

const filters = ["all", "today", "yesterday"] as const;

export function AdminOrdersScreen() {
  const [timeframe, setTimeframe] = useState<"all" | "today" | "yesterday">(
    "all",
  );

  const { data, isLoading } = useQuery(getFilteredOrdersQueryOptions(timeframe));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-(--near-black)">Orders</h2>
        <div className="flex gap-1 rounded-xl bg-(--off-white) p-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTimeframe(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                timeframe === f
                  ? "bg-white text-(--near-black) shadow-sm"
                  : "text-(--medium-gray) hover:text-(--dark-gray)",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="card-white p-8 text-center text-sm text-(--medium-gray)">
          Loading orders…
        </div>
      ) : (
        <TodayOrdersTable data={data ?? []} />
      )}
    </div>
  );
}
