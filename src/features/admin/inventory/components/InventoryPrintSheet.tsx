import { forwardRef } from "react";
import type { InventoryItem, InventoryItemType } from "../types";

interface InventoryPrintSheetProps {
	title: string;
	items: InventoryItem[];
	ledgerTab: "admin" | "storefront";
	showFinancialColumns?: boolean;
	printedAt?: Date;
}

function itemTypeLabel(type: InventoryItemType) {
	if (type === "CUP") return "Cup Size";
	if (type === "SUPPLIES") return "Supplies";
	return "Standalone";
}

function getLedger(item: InventoryItem, tab: "admin" | "storefront") {
	if (tab === "admin") {
		return {
			beginning: item.beginningAdmin,
			in: item.inAdmin,
			out: item.outAdmin,
			ending: item.endingAdmin,
		};
	}
	return {
		beginning: item.beginningStore,
		in: item.inStore,
		out: item.outStore,
		ending: item.endingStore,
	};
}

export const InventoryPrintSheet = forwardRef<
	HTMLDivElement,
	InventoryPrintSheetProps
>(function InventoryPrintSheet(
	{ title, items, ledgerTab, showFinancialColumns = true, printedAt = new Date() },
	ref,
) {
	const displayDate = printedAt.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const displayTime = printedAt.toLocaleString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return (
		<div ref={ref} className="bg-white p-6 text-black">
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-black tracking-tight">48 COFFEE</h1>
				<p className="text-sm font-medium">
					Ledesma St., Iloilo City Proper, Iloilo City, 5000
				</p>
				<h2 className="mt-2 text-lg font-bold uppercase">{title}</h2>
				<p className="mt-1 text-sm">
					{displayDate} · {displayTime}
				</p>
				<p className="text-sm text-gray-600">{items.length} item(s)</p>
			</div>

			<table className="w-full border-collapse text-sm">
				<thead>
					<tr className="border-b-2 border-black">
						<th className="py-2 text-left font-bold">Item</th>
						<th className="py-2 text-left font-bold">Type</th>
						<th className="py-2 text-center font-bold">Beg.</th>
						<th className="py-2 text-center font-bold">In</th>
						<th className="py-2 text-center font-bold">Out</th>
						<th className="py-2 text-center font-bold">End</th>
						{showFinancialColumns && ledgerTab === "admin" ? (
							<th className="py-2 text-right font-bold">Unit Price</th>
						) : null}
					</tr>
				</thead>
				<tbody>
					{items.map((item) => {
						const ledger = getLedger(item, ledgerTab);
						return (
							<tr key={item.id} className="border-b border-gray-300">
								<td className="py-2 pr-2 font-medium">{item.name}</td>
								<td className="py-2 pr-2">{itemTypeLabel(item.type)}</td>
								<td className="py-2 text-center">{ledger.beginning}</td>
								<td className="py-2 text-center">{ledger.in}</td>
								<td className="py-2 text-center">{ledger.out}</td>
								<td className="py-2 text-center font-bold">{ledger.ending}</td>
								{showFinancialColumns && ledgerTab === "admin" ? (
									<td className="py-2 text-right">
										₱{item.costPrice.toFixed(2)}
									</td>
								) : null}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
});
