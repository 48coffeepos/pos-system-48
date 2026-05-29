import { CoffeeIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import type { MenuItem } from "../types";
import { PosProductCard } from "./ui/PosProductCard";

interface PosProductGridProps {
	menuItems: MenuItem[];
	loading: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	onProductClick: (item: MenuItem) => void;
}

export function PosProductGrid({
	menuItems,
	loading,
	search,
	onSearchChange,
	onProductClick,
}: PosProductGridProps) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden p-1.5 lg:p-4">
			<div className="relative mb-1.5 lg:mb-4">
				<MagnifyingGlassIcon className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-(--medium-gray) lg:left-4 lg:size-5" />
				<Input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search menu items..."
					className="h-7 w-full rounded-[5px] border-(--light-gray) bg-(--pure-white) pl-8 pr-7 text-[9px] text-(--dark-gray) placeholder:text-(--medium-gray) lg:h-12 lg:rounded-xl lg:pl-12 lg:pr-12 lg:text-sm"
				/>
				{search ? (
					<button
						type="button"
						onClick={() => onSearchChange("")}
						className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 rounded-[3px] bg-(--light-gray) px-1 py-0.5 text-[7px] font-medium text-(--medium-gray) hover:text-(--dark-gray) lg:right-4 lg:gap-1 lg:rounded-md lg:px-2 lg:py-1 lg:text-xs"
						aria-label="Clear search"
					>
						<XIcon className="size-2 lg:size-3" />
						Clear
					</button>
				) : null}
			</div>

			<div className="flex-1 overflow-y-auto pr-2">
				{loading ? (
					<div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: known array length
								key={i}
								className="animate-pulse rounded-2xl border border-(--light-gray) bg-(--off-white) p-3 lg:p-4"
							>
								<div className="mb-2 h-16 rounded-xl bg-(--light-gray) lg:mb-3 lg:h-24" />
								<div className="mb-2 h-4 w-3/4 rounded bg-(--light-gray)" />
								<div className="h-4 w-1/3 rounded bg-(--light-gray)" />
							</div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3 xl:grid-cols-4 pt-3">
						{menuItems.map((item) => (
							<PosProductCard
								key={item.menu_id}
								name={item.name}
								price={
									item.price ??
									(item.inventory_items.length > 0
										? Math.min(...item.inventory_items.map((i) => i.price))
										: null)
								}
								type={item.type}
								onSelect={() => onProductClick(item)}
							/>
						))}
					</div>
				)}

				{!loading && menuItems.length === 0 ? (
					<div className="flex h-48 flex-col items-center justify-center lg:h-64">
						<CoffeeIcon className="mb-3 size-10 text-(--light-gray) lg:size-12" />
						<p className="text-xs text-(--medium-gray) lg:text-sm">No items found</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
