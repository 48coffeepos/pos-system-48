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
		<div className="flex flex-1 flex-col overflow-hidden p-1.5 md:p-4">
			<div className="relative mb-1.5 md:mb-4">
				<MagnifyingGlassIcon className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-(--medium-gray) md:left-4 md:size-5" />
				<Input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search menu items..."
					className="h-7 w-full rounded-[5px] border-(--light-gray) bg-(--pure-white) pl-8 pr-7 text-[9px] text-(--dark-gray) placeholder:text-(--medium-gray) md:h-12 md:rounded-xl md:pl-12 md:pr-12 md:text-sm"
				/>
				{search ? (
					<button
						type="button"
						onClick={() => onSearchChange("")}
						className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 rounded-[3px] bg-(--light-gray) px-1 py-0.5 text-[7px] font-medium text-(--medium-gray) hover:text-(--dark-gray) md:right-4 md:gap-1 md:rounded-md md:px-2 md:py-1 md:text-xs"
						aria-label="Clear search"
					>
						<XIcon className="size-2 md:size-3" />
						Clear
					</button>
				) : null}
			</div>

			<div className="flex-1 overflow-y-auto pr-2">
				{loading ? (
					<div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-3 lg:grid-cols-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: known array length
								key={i}
								className="animate-pulse rounded-2xl border border-(--light-gray) bg-(--off-white) p-3 md:p-4"
							>
								<div className="mb-2 h-16 rounded-xl bg-(--light-gray) md:mb-3 md:h-24" />
								<div className="mb-2 h-4 w-3/4 rounded bg-(--light-gray)" />
								<div className="h-4 w-1/3 rounded bg-(--light-gray)" />
							</div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-3 lg:grid-cols-4 pt-3">
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
					<div className="flex h-48 flex-col items-center justify-center md:h-64">
						<CoffeeIcon className="mb-3 size-10 text-(--light-gray) md:size-12" />
						<p className="text-xs text-(--medium-gray) md:text-sm">No items found</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
