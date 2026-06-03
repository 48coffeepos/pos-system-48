import {
	MagnifyingGlassIcon,
	NotePencilIcon,
	PackageIcon,
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
import type { InventoryItem } from "./AddInventoryItem";

interface ExtendedInventoryItem extends InventoryItem {
	yesterdayStock?: number;
	adminStock: number;
	price: number;
	piecesPerPack: number;
	isSellable: boolean;
}

function InventoryList({
	items = [],
	onEdit,
	hideActions = false,
	activeTab = "admin",
	onTabChange,
}: {
	items?: ExtendedInventoryItem[];
	onEdit?: (item: ExtendedInventoryItem) => void;
	hideActions?: boolean;
	activeTab?: "storefront" | "admin";
	onTabChange?: (tab: "storefront" | "admin") => void;
}) {
	const [timeframe, setTimeframe] = useState<"today" | "yesterday">("today");
	const [search, setSearch] = useState("");
	const [deletingItem, setDeletingItem] =
		useState<ExtendedInventoryItem | null>(null);

	const fuse = useMemo(
		() =>
			new Fuse(items, {
				keys: ["name"],
				threshold: 0.3,
			}),
		[items],
	);

	const visibleItems = useMemo(
		() => (activeTab === "storefront" ? items.filter((i) => i.isSellable) : items),
		[activeTab, items],
	);

	const filtered = useMemo(
		() => (search ? fuse.search(search).map((r) => r.item) : visibleItems),
		[search, fuse, visibleItems],
	);

	const deleteMutation = useMutation({
		...deleteInventoryItemMutationOptions,
		onSettled: () => {
			setDeletingItem(null);
		},
	});

	return (
		<div>
			{items.length === 0 ? (
				/* Empty State Fallback Dropzone */
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-8 text-center">
					<PackageIcon className="mx-auto size-12 text-(--medium-gray)/40" />
					<h2 className="mt-4 text-lg font-semibold text-(--deep-forest)">
						No inventory items yet
					</h2>
				</div>
			) : (
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
					{/* Header Controls */}
					<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-xl font-bold text-(--deep-forest)">
								Inventory items
							</h2>
							<p className="text-xs text-(--medium-gray) mt-0.5">
								Track item quantity
							</p>
						</div>

						<div className="flex gap-2 self-start sm:self-auto">
							{/* Timeframe Pill Switcher — only on storefront tab */}
							{activeTab === "storefront" && (
								<div className="flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1">
									<button
										type="button"
										onClick={() => setTimeframe("today")}
										className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
											timeframe === "today"
												? "bg-(--deep-forest) text-(--pure-white)"
												: "text-(--medium-gray) hover:bg-(--light-gray)/50"
										}`}
									>
										Today
									</button>
									<button
										type="button"
										onClick={() => setTimeframe("yesterday")}
										className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
											timeframe === "yesterday"
												? "bg-(--deep-forest) text-(--pure-white)"
												: "text-(--medium-gray) hover:bg-(--light-gray)/50"
										}`}
									>
										Yesterday
									</button>
								</div>
							)}
							{/* Stock View Tab Toggle — only show when onTabChange is provided */}
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
								</div>
							)}
						</div>
					</div>

					{/* Search */}
					<div className="relative mb-4">
						<MagnifyingGlassIcon
							className="absolute top-1/2 left-4 size-4 -translate-y-1/2"
							style={{ color: "var(--medium-gray)" }}
						/>
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search inventory items..."
							className="h-10 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all"
							style={{ background: "white", borderColor: "var(--light-gray)" }}
						/>
					</div>

					{/* Structured Responsive Table */}
					<div className="w-full overflow-x-auto">
						<table className="w-full border-collapse text-left">
							<thead>
								<tr className="border-b border-(--light-gray)/40 bg-(--soft-peach)/20 text-[11px] font-bold tracking-wider text-(--medium-gray)/80 uppercase">
									<th className="rounded-l-lg p-3 pl-4">Item</th>
									<th className="p-3 text-center">
										{activeTab === "admin" ? "Admin Stock" : "Quantity"}
									</th>
									{activeTab === "admin" && (
										<th className="p-3 text-center">Price</th>
									)}
									{!hideActions && (
										<th className="rounded-r-lg p-3 pr-4 text-right">Actions</th>
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-(--light-gray)/40">
								{filtered.length > 0 ? (
									filtered.map((item) => (
										<tr
											key={item.id}
											className="group hover:bg-(--light-gray)/10"
										>
											{/* Column 1: Metadata Badge & Labels */}
											<td className="p-4 pl-4">
												<div className="flex items-center gap-3">
													<div>
														<p className="font-semibold text-sm text-(--deep-forest)">
															{item.name}
														</p>
														<span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mt-0.5 bg-amber-100 text-amber-800">
															{item.type === "CUP" ? "Cup Size" : "Standalone"}
														</span>
													</div>
												</div>
											</td>

											{/* Column 2: Stock value based on active tab */}
											<td className="p-4 text-center font-bold text-sm text-(--deep-forest)">
												{activeTab === "admin"
													? `${item.adminStock ?? 0} pk(s)`
													: timeframe === "today"
														? `${item.stock} pc(s)`
														: `${item.yesterdayStock ?? 0} pc(s)`}
											</td>

											{/* Column 3: Price per pack (admin tab only) */}
											{activeTab === "admin" && (
												<td className="p-4 text-center text-sm text-(--deep-forest)">
													{item.price > 0 ? (
														<>
															<span className="font-semibold">₱{item.price.toFixed(2)}</span>
															{!item.isSellable && (
																<span className="ml-1 text-[10px] text-(--medium-gray)">(Supplies)</span>
															)}
															{item.isSellable && item.piecesPerPack > 1 && (
																<span className="ml-1 text-[10px] text-(--medium-gray)">/ {item.piecesPerPack} pcs</span>
															)}
														</>
													) : (
														<span className="text-(--medium-gray)">—</span>
													)}
												</td>
											)}

											{/* Column 4: Row Mutations (Edit Profile/Remove) */}
											{!hideActions && (
												<td className="p-4 pr-4 text-right">
													<div className="flex items-center justify-end gap-3 text-(--medium-gray)">
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
													</div>
												</td>
											)}
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={hideActions ? (activeTab === "admin" ? 3 : 2) : (activeTab === "admin" ? 4 : 3)}
											className="h-24 text-center text-sm text-(--medium-gray)"
										>
											No items match your search.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
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