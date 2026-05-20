import { useState } from "react";
import { Download } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAYMENTS, type PaymentMethod } from "../data/mockData";
import { formatPeso } from "../utils";

interface RevenueCardProps {
	revenue: number;
	orderCount: number;
	periodSubtitle: string;
	onExportClick: () => void;
}

export function RevenueCard({
	revenue,
	orderCount,
	periodSubtitle,
	onExportClick,
}: RevenueCardProps) {
	const [payment, setPayment] = useState<PaymentMethod>("all");

	return (
		<div className="card-white p-6 lg:col-span-2">
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wider mb-1 text-(--medium-gray)">
						Revenue
					</p>
					<div className="flex items-center gap-4">
						<p className="text-3xl sm:text-4xl font-bold text-(--near-black)">
							{formatPeso(revenue)}
						</p>
						<Button
							variant="ghost"
							size="icon"
							onClick={onExportClick}
							title="Export Options"
							className="rounded-xl border border-(--light-gray) hover:bg-gray-100"
						>
							<Download className="w-4 h-4 text-(--deep-forest)" />
						</Button>
					</div>
					<p className="text-xs mt-2 text-(--medium-gray)">
						{periodSubtitle}
					</p>
				</div>
				<div className="flex flex-col items-start sm:items-end gap-1">
					<span className="text-xs text-(--medium-gray)">
						Orders in selection
					</span>
					<span className="text-2xl font-bold text-(--deep-forest)">
						{orderCount}
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
								onClick={() => setPayment(p.key)}
								className={cn(
									"px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
									payment === p.key
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
