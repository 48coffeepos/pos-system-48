import {
  ArrowsLeftRightIcon,
  ClockCounterClockwiseIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  NotePencilIcon,
  PackageIcon,
  PlusCircleIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Fuse from "fuse.js";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/data-table";
import { deleteInventoryItemMutationOptions } from "../mutationOptions";
import type {
  InventoryItem,
  InventoryItemType,
  InventoryLogEntry,
  InventoryTab,
} from "../types";
import { StockroomAdd } from "./stockroom/StockroomAdd";
import { StorefrontDeduct } from "./storefront/StorefrontDeduct";
import { SuppliesEodOutStore } from "./storefront/SuppliesEodOutStore";
import { TransferStock } from "./transfer/TransferStock";

type Tab = InventoryTab;

type InventoryLedgerTab = "admin" | "storefront";

const DEFAULT_ALLOWED_TABS: Tab[] = ["admin", "storefront", "logs"];

function getLedgerForItem(item: InventoryItem, tab: InventoryLedgerTab) {
  if (tab === "admin") {
    return {
      beginning: item.beginningAdmin,
      in: item.inAdmin,
      out: item.outAdmin,
      ending: item.endingAdmin,
    };
  }
  return {
    beginning: item.beginningStore,
    in: item.inStore,
    out: item.outStore,
    ending: item.endingStore,
  };
}

function itemTypeLabel(type: InventoryItemType) {
  if (type === "CUP") return "Cup Size";
  if (type === "SUPPLIES") return "Supplies";
  return "Standalone";
}

function typeBadge(type: string) {
  const styles: Record<string, string> = {
    ADD: "bg-green-100 text-green-700",
    DEDUCT: "bg-red-100 text-red-700",
    EDIT: "bg-blue-100 text-blue-700",
  };
  return styles[type] ?? "bg-gray-100 text-gray-700";
}

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    ADD: "IN",
    DEDUCT: "OUT",
  };
  return labels[type] ?? type;
}

function locationBadge(location: string) {
  const styles: Record<string, string> = {
    STOCKROOM: "bg-amber-100 text-amber-700",
    STOREFRONT: "bg-purple-100 text-purple-700",
  };
  return styles[location] ?? "bg-gray-100 text-gray-700";
}

export interface InventoryListProps {
  items?: InventoryItem[];
  inventoryLogs?: InventoryLogEntry[];
  onEdit?: (item: InventoryItem) => void;
  hideActions?: boolean;
  actions?: "none" | "stock" | "all";
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  showFinancialColumns?: boolean;
  allowedTabs?: Tab[];
  logsLocationFilter?: "ALL" | "STOREFRONT";
}

function InventoryList({
  items = [],
  inventoryLogs = [],
  onEdit,
  hideActions,
  actions = "all",
  activeTab = "admin",
  onTabChange,
  showFinancialColumns = true,
  allowedTabs = DEFAULT_ALLOWED_TABS,
  logsLocationFilter = "ALL",
}: InventoryListProps) {
  const effectiveActions = hideActions ? "none" : actions;
  const showAdminFeatures = allowedTabs.includes("admin");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  const [deductingItem, setDeductingItem] = useState<InventoryItem | null>(
    null,
  );
  const [stockroomingItem, setStockroomingItem] =
    useState<InventoryItem | null>(null);
  const [transferringItem, setTransferringItem] =
    useState<InventoryItem | null>(null);
  const [suppliesEodItem, setSuppliesEodItem] = useState<InventoryItem | null>(
    null,
  );

  const filtered = search
    ? new Fuse(items, { keys: ["name"], threshold: 0.3 })
        .search(search)
        .map((r) => r.item)
    : items;

  const locationFilteredLogs =
    logsLocationFilter === "ALL"
      ? inventoryLogs
      : inventoryLogs.filter((log) => log.location === "STOREFRONT");

  const filteredLogs = search
    ? new Fuse(locationFilteredLogs, {
        keys: ["inventoryItem", "logBy", "type", "location"],
        threshold: 0.3,
      })
        .search(search)
        .map((r) => r.item)
    : locationFilteredLogs;

  const dateFilteredLogs =
    !fromDate && !toDate
      ? filteredLogs
      : filteredLogs.filter((log) => {
          if (!log.dateTime) return true;
          const logDate = new Date(log.dateTime);
          logDate.setHours(0, 0, 0, 0);
          if (fromDate) {
            const [fy, fm, fd] = fromDate.split("-").map(Number);
            const from = new Date(fy, fm - 1, fd);
            if (logDate < from) return false;
          }
          if (toDate) {
            const [ty, tm, td] = toDate.split("-").map(Number);
            const end = new Date(ty, tm - 1, td, 23, 59, 59, 999);
            if (logDate > end) return false;
          }
          return true;
        });

  const deleteMutation = useMutation({
    ...deleteInventoryItemMutationOptions,
    onSettled: () => {
      setDeletingItem(null);
    },
  });

  const isLogsTab = activeTab === "logs";
  const ledgerTab: InventoryLedgerTab =
    activeTab === "admin" ? "admin" : "storefront";
  const showStockroomFinancialColumns =
    showFinancialColumns && activeTab === "admin";

  const getEmptyMessage = () => {
    if (isLogsTab) {
      if (locationFilteredLogs.length === 0) return "No inventory logs yet";
    } else if (items.length === 0) {
      return "No inventory items yet";
    }
    return "No items match your search.";
  };

  const subtitle = isLogsTab
    ? `${locationFilteredLogs.length} ${locationFilteredLogs.length === 1 ? "log entry" : "log entries"}${fromDate || toDate ? ` · ${dateFilteredLogs.length} shown` : ""}`
    : `${items.length} ${items.length === 1 ? "item" : "items"}`;

  const inventoryColumns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "name",
      header: "Item",

      cell: ({ row }) => (
        <span className="font-semibold text-sm text-(--deep-forest)">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Item Type",
      cell: ({ row }) => (
        <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-800">
          {itemTypeLabel(row.original.type)}
        </span>
      ),
    },
    {
      id: "beginning",
      header: "Beginning",
      cell: ({ row }) => {
        const ledger = getLedgerForItem(row.original, ledgerTab);
        return (
          <span className="text-center text-sm text-(--deep-forest)">
            {ledger.beginning}
          </span>
        );
      },
    },
    {
      id: "in",
      header: "In",
      cell: ({ row }) => {
        const ledger = getLedgerForItem(row.original, ledgerTab);
        return (
          <span className="text-center text-sm text-(--deep-forest)">
            {ledger.in}
          </span>
        );
      },
    },
    {
      id: "out",
      header: "Out",
      cell: ({ row }) => {
        const ledger = getLedgerForItem(row.original, ledgerTab);
        return (
          <span className="text-center text-sm text-(--deep-forest)">
            {ledger.out}
          </span>
        );
      },
    },
    {
      id: "ending",
      header: "Ending",
      cell: ({ row }) => {
        const ledger = getLedgerForItem(row.original, ledgerTab);
        return (
          <span className="text-center font-bold text-sm text-(--deep-forest)">
            {ledger.ending}
          </span>
        );
      },
    },
  ];

  if (showStockroomFinancialColumns) {
    inventoryColumns.push({
      accessorKey: "costPrice",
      header: "Unit Price",

      cell: ({ row }) => (
        <span className="text-center text-sm text-(--dark-gray)">
          ₱{row.original.costPrice.toFixed(2)}
        </span>
      ),
    });
  }

  if (effectiveActions !== "none") {
    inventoryColumns.push({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,

      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-3 text-(--medium-gray)">
            {activeTab === "storefront" && (
              <>
                {item.type === "SUPPLIES" ? (
                  <button
                    type="button"
                    onClick={() => setSuppliesEodItem(item)}
                    className="p-1 hover:text-(--deep-forest) transition-colors"
                    aria-label="Record daily usage"
                  >
                    <MinusCircleIcon size={22} weight="bold" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeductingItem(item)}
                    className="p-1 hover:text-red-600 transition-colors"
                    aria-label="Deduct stock from storefront"
                  >
                    <MinusCircleIcon size={22} weight="bold" />
                  </button>
                )}
                <span className="text-(--light-gray)">|</span>
              </>
            )}
            {showAdminFeatures && activeTab === "admin" && (
              <>
                <button
                  type="button"
                  onClick={() => setStockroomingItem(item)}
                  className="p-1 hover:text-(--deep-forest) transition-colors"
                  aria-label="Add stock to stockroom"
                >
                  <PlusCircleIcon size={22} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => setTransferringItem(item)}
                  className="p-1 hover:text-(--deep-forest) transition-colors"
                  aria-label="Transfer stock to storefront"
                >
                  <ArrowsLeftRightIcon size={22} weight="bold" />
                </button>
                <span className="text-(--light-gray)">|</span>
              </>
            )}
            {effectiveActions === "all" && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.(item)}
                  className="p-1 hover:text-(--deep-forest) transition-colors"
                  aria-label="Edit item"
                >
                  <NotePencilIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(item)}
                  className="p-1 hover:text-red-600 transition-colors"
                  aria-label="Delete item record"
                >
                  <TrashIcon size={18} />
                </button>
              </>
            )}
          </div>
        );
      },
    });
  }

  const logsColumns: ColumnDef<InventoryLogEntry>[] = [
    {
      accessorKey: "dateTime",
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.dateTime;
        return (
          <span className="text-sm text-(--dark-gray) whitespace-nowrap">
            {date
              ? new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "inventoryItem",
      header: "Item",
      cell: ({ row }) => (
        <span className="font-semibold text-sm text-(--deep-forest)">
          {row.original.inventoryItem}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className="flex items-center gap-1">
            <span
              className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${typeBadge(type)}`}
            >
              {typeLabel(type)}
            </span>
            {row.original.columnName && (
              <span className="inline-block rounded bg-(--medium-gray)/10 px-1.5 py-0.5 text-[12px] font-medium text-(--medium-gray)">
                {row.original.columnName.split("_")[0].toUpperCase()}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span
          className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${locationBadge(row.original.location)}`}
        >
          {row.original.location === "STOCKROOM" ? "Stockroom" : "Storefront"}
        </span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <span className="font-bold text-sm text-(--deep-forest)">
          {row.original.quantity ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "logBy",
      header: "Logged By",
      cell: ({ row }) => (
        <span className="text-sm text-(--dark-gray)">{row.original.logBy}</span>
      ),
    },
  ];

  if (showFinancialColumns) {
    logsColumns.push({
      accessorKey: "expense",
      header: "Expense",
      cell: ({ row }) => {
        const expense = row.original.expense;
        if (expense == null)
          return <span className="pr-4 text-sm text-(--dark-gray)">—</span>;
        const num = Number(expense);
        return (
          <span className="pr-4 text-sm text-(--dark-gray)">
            {num < 0 ? `-₱${Math.abs(num).toFixed(2)}` : `₱${num.toFixed(2)}`}
          </span>
        );
      },
    });
  }

  const emptyMessage = getEmptyMessage();
  const emptyState = (
    <div className="flex flex-col items-center gap-2 py-4 text-sm text-(--medium-gray)">
      <PackageIcon className="size-10 text-(--medium-gray)/40" />
      <span>{emptyMessage}</span>
    </div>
  );

  return (
    <div>
      <div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-(--deep-forest)">
              {isLogsTab ? "Inventory Logs" : "Inventory items"}
            </h2>
            <p className="text-xs text-(--medium-gray) mt-0.5">
              {isLogsTab
                ? "Track stock movements and changes"
                : "Track item quantity"}
              {" · "}
              {subtitle}
            </p>
          </div>

          <div className="flex gap-2 self-start sm:self-auto">
            {onTabChange && (
              <div className="flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
                {allowedTabs.includes("admin") ? (
                  <button
                    type="button"
                    onClick={() => onTabChange("admin")}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      activeTab === "admin"
                        ? "bg-(--deep-forest) text-(--pure-white)"
                        : "text-(--medium-gray) hover:bg-(--light-gray)/50"
                    }`}
                  >
                    Admin
                  </button>
                ) : null}
                {allowedTabs.includes("storefront") ? (
                  <button
                    type="button"
                    onClick={() => onTabChange("storefront")}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      activeTab === "storefront"
                        ? "bg-(--deep-forest) text-(--pure-white)"
                        : "text-(--medium-gray) hover:bg-(--light-gray)/50"
                    }`}
                  >
                    Storefront
                  </button>
                ) : null}
                {allowedTabs.includes("logs") ? (
                  <button
                    type="button"
                    onClick={() => onTabChange("logs")}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      activeTab === "logs"
                        ? "bg-(--deep-forest) text-(--pure-white)"
                        : "text-(--medium-gray) hover:bg-(--light-gray)/50"
                    }`}
                  >
                    <ClockCounterClockwiseIcon
                      weight="bold"
                      className="mr-1 inline-block size-3.5"
                    />
                    Logs
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-4">
          <MagnifyingGlassIcon
            className="absolute top-1/2 left-4 size-4 -translate-y-1/2"
            style={{ color: "var(--medium-gray)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isLogsTab ? "Search..." : "Search inventory items..."}
            className="h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all"
            style={{ background: "white", borderColor: "var(--light-gray)" }}
          />
        </div>

        {isLogsTab && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="fromDate"
                className="text-xs font-medium text-(--medium-gray)"
              >
                From
              </label>
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 rounded-xl border border-(--light-gray) px-3 text-sm outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="toDate"
                className="text-xs font-medium text-(--medium-gray)"
              >
                To
              </label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 rounded-xl border border-(--light-gray) px-3 text-sm outline-none transition-all"
              />
            </div>
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="text-xs font-medium text-(--medium-gray) hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {isLogsTab ? (
          <DataTable<InventoryLogEntry>
            key="logs"
            columns={logsColumns}
            data={dateFilteredLogs}
            pageSize={9999}
            empty={emptyState}
          />
        ) : (
          <DataTable<InventoryItem>
            key={ledgerTab}
            columns={inventoryColumns}
            data={filtered}
            pageSize={9999}
            empty={emptyState}
          />
        )}
      </div>

      {deductingItem && (
        <StorefrontDeduct
          item={{ id: deductingItem.id, name: deductingItem.name }}
          open={!!deductingItem}
          onOpenChange={(open) => {
            if (!open) setDeductingItem(null);
          }}
        />
      )}

      {showAdminFeatures && stockroomingItem ? (
        <StockroomAdd
          item={{
            id: stockroomingItem.id,
            name: stockroomingItem.name,
            costPrice: stockroomingItem.costPrice,
          }}
          open={!!stockroomingItem}
          onOpenChange={(open) => {
            if (!open) setStockroomingItem(null);
          }}
        />
      ) : null}

      {showAdminFeatures && transferringItem ? (
        <TransferStock
          item={{
            id: transferringItem.id,
            name: transferringItem.name,
            endingAdmin: transferringItem.endingAdmin,
          }}
          open={!!transferringItem}
          onOpenChange={(open) => {
            if (!open) setTransferringItem(null);
          }}
        />
      ) : null}

      {suppliesEodItem && (
        <SuppliesEodOutStore
          item={{
            id: suppliesEodItem.id,
            name: suppliesEodItem.name,
            endingStore: suppliesEodItem.endingStore,
          }}
          open={!!suppliesEodItem}
          onOpenChange={(open) => {
            if (!open) setSuppliesEodItem(null);
          }}
        />
      )}

      <AlertDialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <WarningCircleIcon
                weight="fill"
                className="size-8 text-red-500"
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deletingItem?.name}</strong>{" "}
              from inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deletingItem) {
                  deleteMutation.mutate({ id: deletingItem.id });
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export type { InventoryLogEntry, Tab };
export { InventoryList };
