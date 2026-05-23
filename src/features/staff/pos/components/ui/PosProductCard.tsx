import { formatPeso } from "@/lib/format-currency";

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
			className="group flex h-32 cursor-pointer flex-col rounded-2xl border border-border bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
		>
			<h3
				className="mb-1 text-lg font-bold line-clamp-2 wrap-break-word text-foreground"
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
