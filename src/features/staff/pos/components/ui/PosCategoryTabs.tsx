interface PosCategoryTabsProps {
	activeCategory: string;
	onCategoryChange: (key: string) => void;
	categories: Array<{ key: string; label: string }>;
}

export function PosCategoryTabs({
	activeCategory,
	onCategoryChange,
	categories,
}: PosCategoryTabsProps) {
	return (
		<div className="mb-4 flex gap-2 overflow-x-auto pb-1">
			<button
				type="button"
				onClick={() => onCategoryChange("all")}
				className="rounded-full px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200"
				style={{
					background:
						activeCategory === "all"
							? "var(--deep-forest)"
							: "transparent",
					color: activeCategory === "all" ? "white" : "var(--dark-gray)",
					border:
						activeCategory === "all"
							? "none"
							: "1px solid var(--light-gray)",
				}}
			>
				All
			</button>
			{categories.map((cat) => (
				<button
					key={cat.key}
					type="button"
					onClick={() => onCategoryChange(cat.key)}
					className="rounded-full px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200"
					style={{
						background:
							activeCategory === cat.key
								? "var(--deep-forest)"
								: "transparent",
						color: activeCategory === cat.key ? "white" : "var(--dark-gray)",
						border:
							activeCategory === cat.key
								? "none"
								: "1px solid var(--light-gray)",
					}}
				>
					{cat.label}
				</button>
			))}
		</div>
	);
}
