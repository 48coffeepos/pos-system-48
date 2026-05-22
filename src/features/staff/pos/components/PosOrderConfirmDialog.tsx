import { formatPeso } from "@/lib/format-currency";
import { PosModal } from "./ui/PosModal";

interface PosOrderConfirmDialogProps {
	open: boolean;
	total: number;
	isLoading?: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export function PosOrderConfirmDialog({
	open,
	total,
	isLoading = false,
	onClose,
	onConfirm,
}: PosOrderConfirmDialogProps) {
	return (
		<PosModal open={open} onClose={onClose}>
			<h3
				className="text-lg font-bold"
				style={{ color: "var(--near-black)" }}
			>
				Confirm Order
			</h3>
			<p className="mt-2 mb-6 text-sm" style={{ color: "var(--medium-gray)" }}>
				Are you sure you want to place this order for {formatPeso(total)}?
			</p>
			<div className="flex gap-3">
				<button
					type="button"
					onClick={onClose}
					disabled={isLoading}
					className="h-11 flex-1 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
					style={{
						background: "var(--off-white)",
						color: "var(--dark-gray)",
					}}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onConfirm}
					disabled={isLoading}
					className="h-11 flex-1 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
					style={{ background: "var(--deep-forest)" }}
				>
					{isLoading ? "Confirming..." : "Confirm"}
				</button>
			</div>
		</PosModal>
	);
}
