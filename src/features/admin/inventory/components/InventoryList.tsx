import {
	NotePencilIcon,
	PackageIcon,
	TrashIcon,
	WarningCircleIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
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
import { deleteInventoryItemMutationOptions } from "../mutationOptions";
import type { InventoryItem } from "./AddInventoryItem";

// Ensure your shared type includes yesterday_stock from the query context
// If it doesn't, you can safely extend it here:
interface ExtendedInventoryItem extends InventoryItem {
	yesterdayStock?: number;
}

function InventoryList({
	items = [],
	onEdit,
	hideActions = false,
}: {
	items?: ExtendedInventoryItem[];
	onEdit?: (item: ExtendedInventoryItem) => void;
	hideActions?: boolean;
}) {
	const [timeframe, setTimeframe] = useState<"today" | "yesterday">("today");
	const [deletingItem, setDeletingItem] =
		useState<ExtendedInventoryItem | null>(null);
	const hasItems = items.length > 0;

	const deleteMutation = useMutation({
		...deleteInventoryItemMutationOptions,
		onSettled: () => {
			setDeletingItem(null);
		},
	});

	return (
		<div>
			{hasItems ? (
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
					{/* Header Controls */}
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold text-(--deep-forest)">
								Inventory items
							</h2>
							<p className="text-xs text-(--medium-gray) mt-0.5">
								Track item quantity and category
							</p>
						</div>

						{/* Timeframe Pill Switcher */}
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
					</div>

					{/* Structured Responsive Table */}
					<div className="w-full overflow-x-auto rounded-xl border border-(--light-gray)/40">
						<table className="w-full border-collapse text-left">
							<thead>
								<tr className="border-b border-(--light-gray)/40 bg-(--off-white) text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
									<th className="p-4 pl-6">Item</th>
									<th className="p-4 text-center">Quantity</th>
									{!hideActions && (
										<th className="p-4 pr-6 text-right">Actions</th>
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-(--light-gray)/40">
								{items.map((item) => (
									<tr
										key={item.id}
										className="group transition-colors hover:bg-(--off-white)/50"
									>
										{/* Column 1: Metadata Badge & Labels */}
										<td className="p-4 pl-6">
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

										{/* Column 2: Selected Timeframe Quantity Counter */}
										<td className="p-4 text-center font-bold text-sm text-(--deep-forest)">
											{timeframe === "today"
												? item.stock
												: (item.yesterdayStock ?? 0)}
										</td>

										{/* Column 3: Row Mutations (Edit Profile/Remove) */}
										{!hideActions && (
											<td className="p-4 pr-6 text-right">
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
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				/* Empty State Fallback Dropzone */
				<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-8 text-center">
					<PackageIcon className="mx-auto size-12 text-(--medium-gray)/40" />
					<h2 className="mt-4 text-lg font-semibold text-(--deep-forest)">
						No inventory items yet
					</h2>
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
