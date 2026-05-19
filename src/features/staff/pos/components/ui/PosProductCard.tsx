import { motion } from "motion/react";
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
		<motion.button
			type="button"
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.2 }}
			onClick={onSelect}
			className="group flex h-32 cursor-pointer flex-col rounded-2xl border p-6 text-left transition-all duration-200 hover:-translate-y-0.5"
			style={{
				background: "white",
				borderColor: "var(--light-gray)",
				boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
			}}
			whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
			whileTap={{ scale: 0.95 }}
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
		</motion.button>
	);
}
