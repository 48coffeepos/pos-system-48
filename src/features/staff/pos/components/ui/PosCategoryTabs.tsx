import { Button } from "@/components/ui/button";

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
			<Button
				variant={activeCategory === "all" ? "default" : "outline"}
				size="sm"
				className="rounded-full text-xs font-semibold"
				onClick={() => onCategoryChange("all")}
			>
				All
			</Button>
			{categories.map((cat) => (
				<Button
					key={cat.key}
					variant={activeCategory === cat.key ? "default" : "outline"}
					size="sm"
					className="rounded-full text-xs font-semibold"
					onClick={() => onCategoryChange(cat.key)}
				>
					{cat.label}
				</Button>
			))}
		</div>
	);
}
