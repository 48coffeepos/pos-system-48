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
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
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
import { deleteInventoryItemMutationOptions } from "../mutationOptions";
import { SuppliesEodOutStore } from "./storefront/SuppliesEodOutStore";
import { StorefrontDeduct } from "./storefront/StorefrontDeduct";
import { StockroomAdd } from "./stockroom/StockroomAdd";
import { TransferStock } from "./transfer/TransferStock";
import type { InventoryItem } from "../types";

interface InventoryLogEntry {
	id: string;
	dateTime: Date | null;
	inventoryItem: string;
	logBy: string;
	type: "ADD" | "DEDUCT" | "EDIT" | "TRANSFER";
	location: "STOCKROOM" | "STOREFRONT";
	quantity: number | null;
	expense: number | null;
	columnName?: string | null;
}

type Tab = "storefront" | "admin" | "logs";

type InventoryLedgerTab = "admin" | "storefront";

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

function InventoryList({
	items = [],
	inventoryLogs = [],
	onEdit,
	hideActions,
	actions = "all",
	activeTab = "admin",
	onTabChange,
	showFinancialColumns = true,
}: {
	items?: InventoryItem[];
	inventoryLogs?: InventoryLogEntry[];
	onEdit?: (item: InventoryItem) => void;
	hideActions?: boolean;
	actions?: "none" | "stock" | "all";
	activeTab?: Tab;
	onTabChange?: (tab: Tab) => void;
	showFinancialColumns?: boolean;
}) {
	const effectiveActions = hideActions ? "none" : actions;
	const [search, setSearch] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [deletingItem, setDeletingItem] =
		useState<InventoryItem | null>(null);
	const [deductingItem, setDeductingItem] =
		useState<InventoryItem | null>(null);
	const [stockroomingItem, setStockroomingItem] =
		useState<InventoryItem | null>(null);
	const [transferringItem, setTransferringItem] =
		useState<InventoryItem | null>(null);
	const [suppliesEodItem, setSuppliesEodItem] =
		useState<InventoryItem | null>(null);

	const fuse = useMemo(
		() =>
			new Fuse(items, {
				keys: ["name"],
				threshold: 0.3,
			}),
		[items],
	);

	const filtered = useMemo(
		() => (search ? fuse.search(search).map((r) => r.item) : items),
		[search, fuse, items],
	);

	const logsFuse = useMemo(
		() =>
			new Fuse(inventoryLogs, {
				keys: ["inventoryItem", "logBy", "type", "location"],
				threshold: 0.3,
			}),
		[inventoryLogs],
	);

	const filteredLogs = useMemo(
		() =>
			search
				? logsFuse.search(search).map((r) => r.item)
				: inventoryLogs,
		[search, logsFuse, inventoryLogs],
	);

	const dateFilteredLogs = useMemo(() => {
		if (!fromDate && !toDate) return filteredLogs;
		return filteredLogs.filter((log) => {
			if (!log.dateTime) return true;
			const logDate = new Date(log.dateTime);
			logDate.setHours(0, 0, 0, 0);
			if (fromDate && logDate < new Date(fromDate)) return false;
			if (toDate) {
				const end = new Date(toDate);
				end.setHours(23, 59, 59, 999);
				if (logDate > end) return false;
			}
			return true;
		});
	}, [filteredLogs, fromDate, toDate]);

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
	const currentItems = isLogsTab ? dateFilteredLogs : filtered;
	const hasTabShell = !!onTabChange;
	const showLegacyEmptyState =
		!hasTabShell && (isLogsTab ? inventoryLogs.length === 0 : items.length === 0);

	const inventoryColCount =
		1 +
		4 +
		(showStockroomFinancialColumns ? 1 : 0) +
		(effectiveActions !== "none" ? 1 : 0);
	const logsColCount = 6 + (showFinancialColumns ? 1 : 0);
	const tableColSpan = isLogsTab ? logsColCount : inventoryColCount;

	const getEmptyMessage = () => {
		if (isLogsTab) {
			if (inventoryLogs.length === 0) return "No inventory logs yet";
		} else if (items.length === 0) {
			return "No inventory items yet";
		}
		return "No items match your search.";
	};

	const subtitle = isLogsTab
		? `${inventoryLogs.length} ${inventoryLogs.length === 1 ? "log entry" : "log entries"}${fromDate || toDate ? ` · ${dateFilteredLogs.length} shown` : ""}`
		: `${items.length} ${items.length === 1 ? "item" : "items"}`;

	const typeBadge = (type: string) => {
		const styles: Record<string, string> = {
			ADD: "bg-green-100 text-green-700",
			DEDUCT: "bg-red-100 text-red-700",
			EDIT: "bg-blue-100 text-blue-700",
		};
		return styles[type] ?? "bg-gray-100 text-gray-700";
	};

	const typeLabel = (type: string) => {
		const labels: Record<string, string> = {
			ADD: "IN",
			DEDUCT: "OUT",
		};
		return labels[type] ?? type;
	};

	const locationBadge = (location: string) => {
		const styles: Record<string, string> = {
			STOCKROOM: "bg-amber-100 text-amber-700",
			STOREFRONT: "bg-purple-100 text-purple-700",
		};
		return styles[location] ?? "bg-gray-100 text-gray-700";
	};

	const tableContent = (
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
					placeholder={
						isLogsTab
							? "Search by item, user, location..."
							: "Search inventory items..."
					}
					className="h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all"
					style={{ background: "white", borderColor: "var(--light-gray)" }}
				/>
			</div>

			{isLogsTab && (
				<div className="mb-4 flex flex-wrap items-center gap-3">
					<div className="flex items-center gap-2">
						<label className="text-xs font-medium text-(--medium-gray)">From</label>
						<input
							type="date"
							value={fromDate}
							onChange={(e) => setFromDate(e.target.value)}
							className="h-9 rounded-xl border border-(--light-gray) px-3 text-sm outline-none transition-all"
						/>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-xs font-medium text-(--medium-gray)">To</label>
						<input
							type="date"
							value={toDate}
							onChange={(e) => setToDate(e.target.value)}
							className="h-9 rounded-xl border border-(--light-gray) px-3 text-sm outline-none transition-all"
						/>
					</div>
					{(fromDate || toDate) && (
						<button
							type="button"
							onClick={() => { setFromDate(""); setToDate(""); }}
							className="text-xs font-medium text-(--medium-gray) hover:text-red-500 transition-colors"
						>
							Clear
						</button>
					)}
				</div>
			)}

			<div className="w-full overflow-x-auto">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-(--light-gray)/40 bg-(--soft-peach)/20 text-[11px] font-bold tracking-wider text-(--medium-gray)/80 uppercase">
							{isLogsTab ? (
								<>
									<th className="rounded-l-lg p-3 pl-4">Date</th>
									<th className="p-3">Item</th>
									<th className="p-3">Type</th>
									<th className="p-3">Location</th>
									<th className="p-3">Quantity</th>
									<th
										className={`p-3 ${showFinancialColumns ? "" : "rounded-r-lg pr-4"}`}
									>
										Logged By
									</th>
									{showFinancialColumns && (
										<th className="rounded-r-lg p-3 pr-4">Expense</th>
									)}
								</>
							) : (
								<>
									<th className="rounded-l-lg p-3 pl-4">Item</th>
									<th className="p-3 text-center">Beginning</th>
									<th className="p-3 text-center">In</th>
									<th className="p-3 text-center">Out</th>
									<th className="p-3 text-center">Ending</th>
									{showStockroomFinancialColumns && (
										<th
											className={`p-3 text-center ${effectiveActions === "none" ? "rounded-r-lg pr-4" : ""}`}
										>
											Unit Price
										</th>
									)}
									{effectiveActions !== "none" && (
										<th className="rounded-r-lg p-3 pr-4 text-right">
											Actions
										</th>
									)}
								</>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-(--light-gray)/40">
						{currentItems.length > 0 ? (
							isLogsTab ? (
								(filteredLogs as InventoryLogEntry[]).map((log) => (
									<tr
										key={log.id}
										className="group hover:bg-(--light-gray)/10"
									>
										<td className="p-4 pl-4 text-sm text-(--dark-gray) whitespace-nowrap">
											{log.dateTime
												? new Date(log.dateTime).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
													})
												: "—"}
										</td>
										<td className="p-4 text-sm font-semibold text-(--deep-forest)">
											{log.inventoryItem}
										</td>
										<td className="p-4">
											<span
												className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${typeBadge(log.type)}`}
											>
												{typeLabel(log.type)}
											</span>
											{log.columnName && (
												<span className="ml-1.5 inline-block rounded bg-(--medium-gray)/10 px-1.5 py-0.5 text-[12px] font-medium text-(--medium-gray)">
													{(log.columnName).split("_")[0].toUpperCase()}
												</span>
											)}
										</td>
										<td className="p-4">
											<span
												className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${locationBadge(log.location)}`}
											>
												{log.location === "STOCKROOM"
													? "Stockroom"
													: "Storefront"}
											</span>
										</td>
										<td className="p-4 text-sm font-bold text-(--deep-forest)">
											{log.quantity ?? "—"}
										</td>
										<td
											className={`p-4 text-sm text-(--dark-gray) ${!showFinancialColumns ? "pr-4" : ""}`}
										>
											{log.logBy}
										</td>
										{showFinancialColumns && (
											<td className="p-4 pr-4 text-sm text-(--dark-gray)">
											{log.expense != null ? (
												(() => {
												const expense = Number(log.expense);
												return expense < 0
													? `-₱${Math.abs(expense).toFixed(2)}`
													: `₱${expense.toFixed(2)}`;
												})()
											) : (
												"—"
											)}
											</td>
										)}
									</tr>
								))
							) : (
								(filtered as InventoryItem[]).map((item) => {
									const ledger = getLedgerForItem(item, ledgerTab);
									return (
										<tr
											key={item.id}
											className="group hover:bg-(--light-gray)/10"
										>
											<td className="p-4 pl-4">
												<div className="flex items-center gap-3">
													<div>
														<p className="font-semibold text-sm text-(--deep-forest)">
															{item.name}
														</p>
														<span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mt-0.5 bg-amber-100 text-amber-800">
															{item.type === "CUP"
																? "Cup Size"
																: item.type === "SUPPLIES"
																	? "Supplies"
																	: "Standalone"}
														</span>
													</div>
												</div>
											</td>

											<td className="p-4 text-center text-sm text-(--deep-forest)">
												{ledger.beginning}
											</td>
											<td className="p-4 text-center text-sm text-(--deep-forest)">
												{ledger.in}
											</td>
											<td className="p-4 text-center text-sm text-(--deep-forest)">
												{ledger.out}
											</td>
											<td className="p-4 text-center font-bold text-sm text-(--deep-forest)">
												{ledger.ending}
											</td>

											{showStockroomFinancialColumns && (
												<td className="p-4 text-center text-sm text-(--dark-gray)">
													₱{item.costPrice.toFixed(2)}
												</td>
											)}

											{effectiveActions !== "none" && (
												<td className="p-4 pr-4 text-right">
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
																		<ClockCounterClockwiseIcon
																			size={22}
																			weight="bold"
																		/>
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
														{activeTab === "admin" && (
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
												</td>
											)}
										</tr>
									);
								})
							)
						) : (
							<tr>
								<td
									colSpan={tableColSpan}
									className="h-24 text-center text-sm text-(--medium-gray)"
								>
									{getEmptyMessage() === "No inventory items yet" ||
									getEmptyMessage() === "No inventory logs yet" ? (
										<div className="flex flex-col items-center gap-2 py-4">
											<PackageIcon className="size-10 text-(--medium-gray)/40" />
											<span>{getEmptyMessage()}</span>
										</div>
									) : (
										getEmptyMessage()
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);

	return (
		<div>
			{showLegacyEmptyState ? (
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-8 text-center">
					<PackageIcon className="mx-auto size-12 text-(--medium-gray)/40" />
					<h2 className="mt-4 text-lg font-semibold text-(--deep-forest)">
						{isLogsTab ? "No inventory logs yet" : "No inventory items yet"}
					</h2>
				</div>
			) : (
				tableContent
			)}

			{deductingItem && (
				<StorefrontDeduct
					item={{ id: deductingItem.id, name: deductingItem.name }}
					open={!!deductingItem}
					onOpenChange={(open) => {
						if (!open) setDeductingItem(null);
					}}
				/>
			)}

			{stockroomingItem && (
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
			)}

			{transferringItem && (
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
			)}

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

export { InventoryList };
export type { InventoryLogEntry, Tab };
