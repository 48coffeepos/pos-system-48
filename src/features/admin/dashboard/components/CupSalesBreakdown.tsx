import { Download } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { type CupSales } from "../data/mockData";

interface CupSalesBreakdownProps {
	cupSales: CupSales;
	onPrintClick: () => void;
}

export function CupSalesBreakdown({
	cupSales,
	onPrintClick,
}: CupSalesBreakdownProps) {
	return (
		<div className="card-white p-5 mb-6">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h3 className="text-sm font-bold text-(--near-black)">
						Cups Sold by Payment Method
					</h3>
					<p className="text-xs mt-1 text-(--medium-gray)">
						Breakdown by cup size and payment type
					</p>
				</div>
				<Button
					onClick={onPrintClick}
					className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 bg-(--deep-forest) text-white hover:bg-(--deep-forest)/90"
				>
					<Download className="w-3.5 h-3.5" /> Print
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-4 mb-4">
				<div>
					<p className="text-xs font-semibold mb-2 text-(--medium-gray)">
						12 oz Cups
					</p>
					<div className="space-y-2">
						<div className="flex justify-between items-center p-2 rounded-lg bg-(--off-white)">
							<span className="text-xs text-(--dark-gray)">Cash</span>
							<span className="text-sm font-bold text-(--deep-forest)">
								{cupSales.cups_12oz_cash || 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-2 rounded-lg bg-(--off-white)">
							<span className="text-xs text-(--dark-gray)">GCash</span>
							<span className="text-sm font-bold text-(--deep-forest)">
								{cupSales.cups_12oz_gcash || 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-2 rounded-lg bg-(--off-white)">
							<span className="text-xs text-(--dark-gray)">Grab</span>
							<span className="text-sm font-bold text-(--deep-forest)">
								{cupSales.cups_12oz_grab || 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-2 rounded-lg font-bold bg-[rgba(27,67,50,0.1)]">
							<span className="text-xs text-(--deep-forest)">Total</span>
							<span className="text-sm text-(--deep-forest)">
								{cupSales.cups_12oz_sold || 0}
							</span>
						</div>
					</div>
				</div>
				<div>
					<p className="text-xs font-semibold mb-2 text-(--medium-gray)">
						16 oz Cups
					</p>
					<div className="space-y-2">
						<div className="flex justify-between items-center p-2 rounded-lg bg-(--off-white)">
							<span className="text-xs text-(--dark-gray)">Cash</span>
							<span className="text-sm font-bold text-(--deep-forest)">
								{cupSales.cups_16oz_cash || 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-2 rounded-lg bg-(--off-white)">
							<span className="text-xs text-(--dark-gray)">GCash</span>
							<span className="text-sm font-bold text-(--deep-forest)">
								{cupSales.cups_16oz_gcash || 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-2 rounded-lg bg-(--off-white)">
							<span className="text-xs text-(--dark-gray)">Grab</span>
							<span className="text-sm font-bold text-(--deep-forest)">
								{cupSales.cups_16oz_grab || 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-2 rounded-lg font-bold bg-[rgba(27,67,50,0.1)]">
							<span className="text-xs text-(--deep-forest)">Total</span>
							<span className="text-sm text-(--deep-forest)">
								{cupSales.cups_16oz_sold || 0}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
