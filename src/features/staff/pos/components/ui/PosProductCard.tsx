import { Badge } from "@/components/ui/badge";
import { formatPeso } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { posCard } from "../../pos-ui";

interface PosProductCardProps {
	name: string;
	price?: number | null;
	type?: string | null;
	onSelect: () => void;
}

export function PosProductCard({
	name,
	price,
	type,
	onSelect,
}: PosProductCardProps) {
	const typeLabel =
		type === "CUP" ? "Cup" : type === "STANDALONE" ? "Item" : null;

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				posCard,
				"group relative flex h-24 cursor-pointer flex-col p-3 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95 lg:h-32 lg:p-6",
			)}
		>
			{typeLabel && (
				<Badge
					className={cn(
						"absolute top-2 right-2 text-[8px] lg:top-3 lg:right-3 lg:text-[10px]",
						type === "CUP"
							? "bg-(--light-mint) text-(--deep-forest)"
							: "bg-(--off-white) text-(--medium-gray)",
					)}
				>
					{typeLabel}
				</Badge>
			)}
			<h3
				className="mb-1 line-clamp-2 wrap-break-word text-xs font-bold text-(--deep-forest) lg:text-lg"
				title={name}
			>
				{name}
			</h3>
			{price !== null && price !== undefined && (
				<p
					className="text-xs font-bold lg:text-sm"
					style={{ color: "var(--deep-forest)" }}
				>
					{formatPeso(price)}
				</p>
			)}
		</button>
	);
}
