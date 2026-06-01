import { CalendarBlank, CaretLeft, CaretRight, XCircle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { getOrdersQueryOptions } from "@/features/admin/orders/queryOptions";
import { TodayOrdersTable } from "./TodayOrdersTable";

const filters = ["all", "today", "yesterday"] as const;

export function AdminOrdersScreen() {
  const [timeframe, setTimeframe] = useState<"all" | "today" | "yesterday">(
    "all",
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const hasDateRange = fromDate !== "" && toDate !== "";

  const params = hasDateRange
    ? { fromDate, toDate, page }
    : { timeframe, page };

  const { data, isLoading } = useQuery(getOrdersQueryOptions(params));

  const clearDateRange = () => {
    setFromDate("");
    setToDate("");
    setTimeframe("all");
    setPage(1);
  };

  const changeFilter = (f: "all" | "today" | "yesterday") => {
    setTimeframe(f);
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-(--near-black)">Orders</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe pills */}
          <div className="flex gap-1 rounded-xl bg-(--off-white) p-1">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => changeFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                  !hasDateRange && timeframe === f
                    ? "bg-white text-(--near-black) shadow-sm"
                    : "text-(--medium-gray) hover:text-(--dark-gray)",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Date range inputs */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <CalendarBlank className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-(--medium-gray)" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                  if (e.target.value && toDate) {
                    setTimeframe("all");
                  }
                }}
                className="w-36 rounded-lg border border-(--light-gray) bg-white py-1.5 pl-8 pr-2.5 text-xs font-medium text-(--near-black) outline-none focus:border-(--deep-forest)"
              />
            </div>
            <span className="text-xs text-(--medium-gray)">–</span>
            <div className="relative">
              <CalendarBlank className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-(--medium-gray)" />
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                  if (e.target.value && fromDate) {
                    setTimeframe("all");
                  }
                }}
                className="w-36 rounded-lg border border-(--light-gray) bg-white py-1.5 pl-8 pr-2.5 text-xs font-medium text-(--near-black) outline-none focus:border-(--deep-forest)"
              />
            </div>
            {hasDateRange && (
              <button
                type="button"
                onClick={clearDateRange}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-(--medium-gray) hover:text-(--near-black) transition-colors"
              >
                <XCircle className="size-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="card-white p-8 text-center text-sm text-(--medium-gray)">
          Loading orders…
        </div>
      ) : (
        <>
          <TodayOrdersTable data={data?.orders ?? []} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-(--light-gray) bg-(--pure-white) px-4 py-3 sm:px-5 shadow-sm">
              <p className="text-center sm:text-left text-xs font-medium text-(--medium-gray)">
                Page {data?.page ?? page} of {totalPages}
                {" — "}
                {data?.total ?? 0} total orders
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-(--light-gray) bg-white px-2 sm:px-3 py-1.5 text-xs font-semibold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  <CaretLeft className="size-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                {/* Page numbers */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      const cur = data?.page ?? page;
                      return p === 1 || p === totalPages || Math.abs(p - cur) <= 1;
                    })
                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                        acc.push("...");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-0.5 sm:px-1 text-xs text-(--medium-gray)">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          className={cn(
                            "size-7 sm:size-8 rounded-lg text-xs font-semibold transition-all",
                            (data?.page ?? page) === p
                              ? "bg-(--deep-forest) text-white shadow-sm"
                              : "text-(--medium-gray) hover:bg-(--light-gray)/50",
                          )}
                        >
                          {p}
                        </button>
                      ),
                    )}
                </div>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-(--light-gray) bg-white px-2 sm:px-3 py-1.5 text-xs font-semibold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Next</span>
                  <CaretRight className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
