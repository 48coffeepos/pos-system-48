import { cn } from "@/lib/utils";
import { formatPeso } from "@/lib/format-currency";
import { posCard } from "../../pos-ui";

interface PosProductCardProps {
	name: string;
	price?: number | null;
	onSelect: () => void;
}

export function PosProductCard({ name, price, onSelect }: PosProductCardProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				posCard,
				"group flex h-32 cursor-pointer flex-col p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-(--forest-green) hover:shadow-md active:scale-95",
			)}
		>
			<h3
				className="mb-1 line-clamp-2 wrap-break-word text-lg font-bold text-(--deep-forest)"
				title={name}
			>
				{name}
			</h3>
			{price !== null && price !== undefined && (
				<p className="text-sm font-bold" style={{ color: "var(--deep-forest)" }}>
					{formatPeso(price)}
				</p>
			)}
		</button>
	);
}
