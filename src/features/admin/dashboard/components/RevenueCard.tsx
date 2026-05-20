import { DownloadIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAYMENTS, type PaymentMethodFilter } from "../constants";
import { formatPeso } from "../utils";

interface RevenueCardProps {
	revenueByMethod: Record<string, number>;
	ordersByMethod: Record<string, number>;
	totalRevenue: number;
	totalOrders: number;
	selectedPayment: PaymentMethodFilter;
	onPaymentChange: (method: PaymentMethodFilter) => void;
	periodLabel: string;
	onExportClick: () => void;
}

export function RevenueCard({
	revenueByMethod,
	ordersByMethod,
	totalRevenue,
	totalOrders,
	selectedPayment,
	onPaymentChange,
	periodLabel,
	onExportClick,
}: RevenueCardProps) {
	const displayedRevenue =
		selectedPayment === "all"
			? totalRevenue
			: (revenueByMethod[selectedPayment] ?? 0);

	const displayedOrders =
		selectedPayment === "all"
			? totalOrders
			: (ordersByMethod[selectedPayment] ?? 0);

	return (
		<div className="card-white p-6 w-full">
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wider mb-1 text-(--medium-gray)">
						Revenue
					</p>
					<div className="flex items-center gap-4">
						<p className="text-3xl sm:text-4xl font-bold text-(--near-black)">
							{formatPeso(displayedRevenue)}
						</p>
						<Button
							variant="ghost"
							size="icon"
							onClick={onExportClick}
							title="Export Options"
							className="rounded-xl border border-(--light-gray) hover:bg-gray-100"
						>
							<DownloadIcon className="w-4 h-4 text-(--deep-forest)" />
						</Button>
					</div>
					<p className="text-xs mt-2 text-(--medium-gray)">
						Today &mdash; {periodLabel}
					</p>
				</div>
				<div className="flex flex-col items-start sm:items-end gap-1">
					<span className="text-xs text-(--medium-gray)">
						Orders in selection
					</span>
					<span className="text-2xl font-bold text-(--deep-forest)">
						{displayedOrders}
					</span>
				</div>
			</div>

			<div className="space-y-4">
				<div>
					<p className="text-xs font-medium mb-2 text-(--medium-gray)">
						Payment Method
					</p>
					<div className="flex flex-wrap gap-2">
						{PAYMENTS.map((p) => (
							<button
								key={p.key}
								type="button"
								onClick={() => onPaymentChange(p.key)}
								className={cn(
									"px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
									selectedPayment === p.key
										? "bg-(--deep-forest) text-white border-transparent"
										: "bg-(--off-white) text-(--dark-gray) border-(--light-gray)",
								)}
							>
								{p.label}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
