import { PackageIcon, TrashIcon } from "@phosphor-icons/react";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { MenuListItem } from "../types";

interface MenuCardProps {
	item: MenuListItem;
	onEdit?: (item: MenuListItem) => void;
	onDelete?: (item: MenuListItem) => void;
}

function MenuCard({ item, onEdit, onDelete }: MenuCardProps) {
	const trackedItems = item.menuInventories;

	const getBasePrice = () => {
		const lowestPrice = trackedItems.reduce(
			(min, entry) => Math.min(min, entry.price),
			Infinity,
		);
		if (lowestPrice === Infinity) return item.price ?? null;
		return `₱${lowestPrice.toFixed(2)}`;
	};

	return (
		<Card className="min-h-55 border-(--light-gray) bg-(--pure-white) shadow-sm transition-transform hover:-translate-y-0.5">
			<CardHeader className="flex-row flex items-start justify-between gap-3 border-b border-(--light-gray) pb-4">
				<div>
					<h2 className="font-bold text-(--near-black)">{item.name}</h2>
					<p className="mt-1 text-sm font-semibold text-(--deep-forest)">
						{getBasePrice() ?? "Base price not set"}
					</p>
				</div>
				<div className="flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)">
					<PackageIcon weight="bold" className="size-5 text-(--deep-forest)" />
				</div>
			</CardHeader>

			<CardContent className="space-y-4 h-full">
				<div className="flex flex-wrap gap-2">
					{item.type ? (
						<span className="rounded-full bg-(--light-mint) px-3 py-1 text-[11px] font-semibold text-(--deep-forest)">
							{item.type}
						</span>
					) : null}
				</div>

				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-wide text-(--medium-gray)">
						Tracking
					</p>
					{trackedItems.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{trackedItems.map((entry) => (
								<span
									key={entry.id}
									className="inline-flex flex-col gap-0.5 rounded-md border border-(--light-gray) bg-(--off-white) px-3 py-2"
								>
									<span className="text-xs font-medium text-(--dark-gray)">
										{entry.inventoryName}
									</span>
									<span className="text-[10px] text-(--medium-gray)">
										₱{entry.price.toFixed(2)}
									</span>
								</span>
							))}
						</div>
					) : (
						<p className="text-sm text-(--medium-gray)">
							No inventory tracking
						</p>
					)}
				</div>
			</CardContent>

			<CardFooter className="gap-2 border-t border-(--light-gray) pt-4">
				<button
					type="button"
					onClick={() => onEdit?.(item)}
					className="flex-1 rounded-xl border border-(--light-gray) px-4 py-2 text-sm font-semibold text-(--deep-forest) transition-colors hover:bg-(--off-white)"
				>
					Edit item
				</button>
				{onDelete ? (
					<button
						type="button"
						onClick={() => onDelete(item)}
						className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
						aria-label={`Delete ${item.name}`}
					>
						<TrashIcon weight="bold" className="size-4" />
					</button>
				) : null}
			</CardFooter>
		</Card>
	);
}

export { MenuCard };
