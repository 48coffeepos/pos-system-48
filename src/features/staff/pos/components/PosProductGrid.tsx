import { MagnifyingGlass, Coffee } from "@phosphor-icons/react";
import { PosCategoryTabs } from "./ui/PosCategoryTabs";
import { PosProductCard } from "./ui/PosProductCard";
import type { MenuItem } from "../types";

interface PosProductGridProps {
	menuItems: MenuItem[];
	loading: boolean;
	search: string;
	activeCategory: string;
	categories: Array<{ key: string; label: string }>;
	onSearchChange: (value: string) => void;
	onCategoryChange: (key: string) => void;
	onProductClick: (item: MenuItem) => void;
}

export function PosProductGrid({
	menuItems,
	loading,
	search,
	activeCategory,
	categories,
	onSearchChange,
	onCategoryChange,
	onProductClick,
}: PosProductGridProps) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden p-4">
			<div className="relative mb-4">
				<MagnifyingGlass
					className="absolute top-1/2 left-4 size-5 -translate-y-1/2"
					style={{ color: "var(--medium-gray)" }}
				/>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search menu items..."
					className="h-12 w-full rounded-xl border pl-12 pr-4 text-sm outline-none transition-all"
					style={{ background: "white", borderColor: "var(--light-gray)" }}
				/>
			</div>


			<div className="flex-1 overflow-y-auto pr-2">
				{loading ? (
					<div className="grid grid-cols-4 gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="animate-pulse rounded-2xl p-4"
								style={{ background: "var(--light-gray)" }}
							>
								<div
									className="mb-3 h-24 rounded-xl"
									style={{ background: "var(--medium-gray)" }}
								/>
								<div
									className="mb-2 h-4 w-3/4 rounded"
									style={{ background: "var(--medium-gray)" }}
								/>
								<div
									className="h-4 w-1/3 rounded"
									style={{ background: "var(--medium-gray)" }}
								/>
							</div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-4 gap-4">
						{menuItems.map((item) => (
							<PosProductCard
								key={item.id}
								name={item.name}
								price={item.price}
								onSelect={() => onProductClick(item)}
							/>
						))}
					</div>
				)}

				{!loading && menuItems.length === 0 ? (
					<div className="flex h-64 flex-col items-center justify-center">
						<Coffee
							className="mb-3 size-12"
							style={{ color: "var(--medium-gray)" }}
						/>
						<p className="text-sm" style={{ color: "var(--medium-gray)" }}>
							No items found
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
