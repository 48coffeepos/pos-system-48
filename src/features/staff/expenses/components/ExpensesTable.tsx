import { useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CurrencyDollarIcon,
  ReceiptIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { getExpensesQueryOptions } from "../queryOptions";
import type { ExpenseRow } from "../server/getExpenses";

type Timeframe = "today" | "yesterday";

const columnHelper = createColumnHelper<ExpenseRow>();

const columns = [
  columnHelper.accessor("type", {
    header: "Type",
    cell: ({ getValue }) => {
      const type = getValue();
      if (type === "CASH_IN") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-600/20">
            <ArrowUpRightIcon weight="bold" className="size-3" />
            Cash In
          </span>
        );
      }
      if (type === "EXPENSE") {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-amber-700 ring-1 ring-amber-600/20">
            <ReceiptIcon weight="bold" className="size-3" />
            Expenses
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-rose-700 ring-1 ring-rose-600/20">
          <ArrowDownRightIcon weight="bold" className="size-3" />
          Cash Out
        </span>
      );
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ getValue }) => {
      const desc = getValue();
      return (
        <span className="font-medium text-(--deep-forest)">
          {desc}
        </span>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue();
      return (
        <span className="font-semibold tabular-nums tracking-tight">
          ₱{amount.toFixed(2)}
        </span>
      );
    },
  }),
  columnHelper.accessor("staff_name", {
    header: "Added By",
    cell: ({ getValue }) => {
      const name = getValue();
      return (
        <span className="text-(--medium-gray)">{name}</span>
      );
    },
  }),
  columnHelper.accessor("timestamp", {
    header: "Date & Time",
    cell: ({ getValue }) => {
      const ts = getValue();
      return (
        <span className="text-(--medium-gray) text-xs">
          {new Date(ts).toLocaleString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      );
    },
  }),
] as ColumnDef<ExpenseRow, string | number>[];

export function ExpensesTable() {
  const [timeframe, setTimeframe] = useState<Timeframe>("today");
  const { data: expenses, isLoading, isError, error, refetch } = useQuery(
    getExpensesQueryOptions(timeframe),
  );

  if (isError) {
    return (
      <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <WarningCircleIcon weight="fill" className="size-10 text-(--error)" />
          <div>
            <p className="text-base font-semibold text-(--deep-forest)">Failed to load expenses</p>
            <p className="mt-1 text-sm text-(--medium-gray)">
              {error?.message ?? "Something went wrong"}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white)">
      <div className="flex items-center justify-between border-b border-(--light-gray) px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-(--deep-forest)">
            <CurrencyDollarIcon
              weight="fill"
              className="size-4 text-(--pale-yellow)"
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-(--deep-forest)">
              Cash Records
            </h2>
            {isLoading ? (
              <p className="text-xs text-(--medium-gray)">Loading...</p>
            ) : (
              <p className="text-xs text-(--medium-gray)">
                {expenses?.length ?? 0} {(expenses?.length ?? 0) === 1 ? "entry" : "entries"}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
          <button
            type="button"
            onClick={() => setTimeframe("today")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              timeframe === "today"
                ? "bg-(--deep-forest) text-(--pure-white)"
                : "text-(--medium-gray) hover:bg-(--light-gray)/50",
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("yesterday")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              timeframe === "yesterday"
                ? "bg-(--deep-forest) text-(--pure-white)"
                : "text-(--medium-gray) hover:bg-(--light-gray)/50",
            )}
          >
            Yesterday
          </button>
        </div>
      </div>
      <div className="p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" />
          </div>
        ) : (
          <DataTable<ExpenseRow, string | number> columns={columns} data={expenses ?? []} pageSize={9999} />
        )}
      </div>
    </div>
  );
}
