import { CreditCardIcon, ReceiptIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PosReceiptDialog } from "@/features/staff/pos/components/PosReceiptDialog";
import type { PosOrder } from "@/features/staff/pos/types";
import { formatPeso } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface TodayOrdersTableProps {
	data: PosOrder[];
	limit?: number;
}

function methodBadge(method: string) {
	const styles: Record<string, string> = {
		CASH: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
		GCASH: "bg-blue-50 text-blue-700 border-blue-200/50",
		GRAB: "bg-orange-50 text-orange-700 border-orange-200/50",
	};
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
				styles[method] ?? "bg-gray-50 text-gray-700 border-gray-200/50",
			)}
		>
			<CreditCardIcon className="size-3" />
			{method}
		</span>
	);
}

export function TodayOrdersTable({ data, limit }: TodayOrdersTableProps) {
	const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
	const displayed = limit ? data.slice(0, limit) : data;

	return (
		<div className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 shadow-sm">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-bold text-(--deep-forest)">
						{limit ? "All Orders Today" : "Orders"}
					</h3>
					<p className="mt-0.5 text-xs text-(--medium-gray)">
						{limit ? "A summary of today's transactions" : "A list of all transactions"}
					</p>
				</div>
				{limit && (
					<Link
						to="/admin/orders"
						className="text-xs font-semibold text-(--deep-forest) hover:underline"
					>
						View Orders
					</Link>
				)}
			</div>

			<div className="w-full overflow-x-auto rounded-xl border border-(--light-gray)/40">
				<table className="hidden sm:table w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-(--light-gray)/40 bg-(--off-white) text-xs font-bold uppercase tracking-wider text-(--medium-gray)">
							<th className="p-4 pl-6 text-center">Order No</th>
							<th className="p-4 text-center">Date & Time</th>
							<th className="p-4 text-center">Payment</th>
							<th className="p-4 text-center">Total</th>
							<th className="p-4 pr-6 no-print text-center">Receipt</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-(--light-gray)/40">
						{displayed.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="p-8 text-center text-sm font-medium text-(--medium-gray)"
								>
									No transactions found.
								</td>
							</tr>
						) : (
							displayed.map((order) => {
								const dateObj = new Date(order.created_at);
								const formattedDate = dateObj.toLocaleDateString("en-GB");
								const formattedTime = dateObj.toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								});

								return (
									<tr
										key={order.order_id}
										className="group hover:bg-(--off-white)/50 transition-colors"
									>
										<td className="p-4 pl-6 font-mono font-bold text-sm text-(--near-black) text-center">
											{order.order_id}
										</td>

										<td className="p-4 text-xs font-medium text-(--near-black) text-center">
											<div className="flex flex-col gap-0.5">
												<span>{formattedDate}</span>
												<span className="text-(--medium-gray)">
													{formattedTime}
												</span>
											</div>
										</td>

										<td className="p-4 text-center">
											<div className="flex flex-col gap-1 items-center">
												{methodBadge(order.method)}
												{order.reference_number ? (
													<span className="text-[10px] font-mono text-(--medium-gray)">
														Ref: {order.reference_number}
													</span>
												) : null}
											</div>
										</td>

										<td className="p-4 font-black text-sm text-(--near-black) text-center">
											{formatPeso(order.grand_total)}
										</td>

										<td className="p-4 pr-6 no-print text-center">
											<button
												type="button"
												onClick={() => setSelectedOrder(order)}
												className="inline-flex items-center gap-1.5 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-xs font-bold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
											>
												<ReceiptIcon className="size-3.5" />
												View Slip
											</button>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>

				<div className="sm:hidden flex flex-col divide-y divide-(--light-gray)/40">
					{displayed.length === 0 ? (
						<div className="p-8 text-center text-sm font-medium text-(--medium-gray)">
							No transactions found.
						</div>
					) : (
						displayed.map((order) => {
							const dateObj = new Date(order.created_at);
							const formattedDate = dateObj.toLocaleDateString("en-GB");
							const formattedTime = dateObj.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
							});

							return (
								<div
									key={order.order_id}
									className="p-4 space-y-2 hover:bg-(--off-white)/50 transition-colors"
								>
									<div className="flex items-center justify-between">
										<span className="text-[11px] font-bold uppercase tracking-wider text-(--medium-gray)">
											Order No
										</span>
										<span className="font-mono font-bold text-sm text-(--near-black)">
											{order.order_id}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-[11px] font-bold uppercase tracking-wider text-(--medium-gray)">
											Date & Time
										</span>
										<span className="text-xs font-medium text-(--near-black)">
											{formattedDate} {formattedTime}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-[11px] font-bold uppercase tracking-wider text-(--medium-gray)">
											Payment
										</span>
										<div className="flex items-center gap-1">
											{methodBadge(order.method)}
										</div>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-[11px] font-bold uppercase tracking-wider text-(--medium-gray)">
											Total
										</span>
										<span className="font-black text-sm text-(--near-black)">
											{formatPeso(order.grand_total)}
										</span>
									</div>

									<div className="flex justify-end pt-1">
										<button
											type="button"
											onClick={() => setSelectedOrder(order)}
											className="inline-flex items-center gap-1.5 rounded-lg border border-(--light-gray) bg-white px-3 py-1.5 text-xs font-bold text-(--near-black) transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
										>
											<ReceiptIcon className="size-3.5" />
											View Slip
										</button>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			<PosReceiptDialog
				order={selectedOrder}
				open={!!selectedOrder}
				onClose={() => setSelectedOrder(null)}
				cashierName={selectedOrder?.cashier_name || "Cashier"}
			/>
		</div>
	);
}
