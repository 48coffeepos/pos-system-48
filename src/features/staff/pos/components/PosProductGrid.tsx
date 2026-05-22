import { CoffeeIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
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
		<div className="flex flex-1 flex-col overflow-hidden p-4">
			<div className="relative mb-4">
				<MagnifyingGlassIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search menu items..."
					className="h-12 w-full rounded-xl pl-12 pr-4 text-sm"
				/>
			</div>

			<div className="flex-1 overflow-y-auto pr-2">
				{loading ? (
					<div className="grid grid-cols-4 gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: known array length
								key={i}
								className="animate-pulse rounded-2xl bg-muted p-4"
							>
								<div className="mb-3 h-24 rounded-xl bg-muted-foreground/20" />
								<div className="mb-2 h-4 w-3/4 rounded bg-muted-foreground/20" />
								<div className="h-4 w-1/3 rounded bg-muted-foreground/20" />
							</div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-4 gap-4">
						{menuItems.map((item) => (
							<PosProductCard
								key={item.menu_id}
								name={item.name}
								price={item.price ?? item.inventory_items[0]?.price ?? null}
								onSelect={() => onProductClick(item)}
							/>
						))}
					</div>
				)}

				{!loading && menuItems.length === 0 ? (
					<div className="flex h-64 flex-col items-center justify-center">
						<CoffeeIcon className="mb-3 size-12 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">No items found</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
