import { formatPeso } from "@/lib/format-currency";

interface PosProductCardProps {
	name: string;
	price?: number | null;
	onSelect: () => void;
}

export function PosProductCard({
	name,
	price,
	onSelect,
}: PosProductCardProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className="group flex h-32 cursor-pointer flex-col rounded-2xl border p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
			style={{
				background: "white",
				borderColor: "var(--light-gray)",
				boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
			}}
		>
			<h3
				className="mb-1 text-lg font-bold"
				style={{ color: "var(--dark-gray)" }}
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
