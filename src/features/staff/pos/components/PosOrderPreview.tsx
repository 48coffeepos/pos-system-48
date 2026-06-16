import { formatPeso } from "@/lib/format-currency";
import type { PosFormValues } from "../schemas/posFormSchema";
import { posBadgeDiscount, posBadgeFree, posSectionMuted } from "../pos-ui";
import type { CartItem } from "../types";
import { formatCupLine } from "../utils";

const paymentLabels: Record<PosFormValues["paymentMethod"], string> = {
	CASH: "Cash",
	GCASH: "GCash",
	GRAB: "Grab",
};

interface PosOrderPreviewProps {
	cart: CartItem[];
	paymentMethod: PosFormValues["paymentMethod"];
	amountPaid: string;
	referenceNumber: string;
	note: string;
	total: number;
}

export function PosOrderPreview({
	cart,
	paymentMethod,
	amountPaid,
	referenceNumber,
	note,
	total,
}: PosOrderPreviewProps) {
	const paidNum = parseFloat(amountPaid) || 0;
	const change = paidNum - total;

	return (
		<div className="space-y-2 md:space-y-3">
			<div className="space-y-1 md:space-y-2">
				{cart.map((item) => {
					const cupLine = formatCupLine(item.cup_type, item.cup_size);
					return (
						<div
							key={item.lineKey}
							className={`rounded-[5px] p-1.5 md:rounded-lg md:p-2.5 ${posSectionMuted}`}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0 flex-1">
									<p
										className="text-[9px] font-bold md:text-sm"
										style={{ color: "var(--dark-gray)" }}
									>
										{item.quantity}x {item.menu_name}
									</p>
									<div className="mt-0.5 flex flex-wrap gap-1">
										{item.is_free_drink ? (
											<span className={posBadgeFree}>Free</span>
										) : null}
										{item.discount ? (
											<span className={posBadgeDiscount}>
												{item.discount === "SENIOR" ? "Senior" : "PWD"} 5%
											</span>
										) : null}
									</div>
									{cupLine ? (
										<p
											className="mt-0.5 text-[8px] font-medium md:text-xs"
											style={{ color: "var(--medium-gray)" }}
										>
											{cupLine}
										</p>
									) : null}
									{item.addon_items && item.addon_items.length > 0 ? (
										<p
											className="text-[8px] font-semibold italic md:text-[11px]"
											style={{ color: "var(--coral)" }}
										>
											+{" "}
											{item.addon_items
												.map((a) => `${a.name} x${a.quantity}`)
												.join(", ")}
										</p>
									) : null}
								</div>
								<p
									className="shrink-0 text-[9px] font-bold md:text-sm"
									style={{ color: "var(--deep-forest)" }}
								>
									{formatPeso(item.total_price)}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			<div className="space-y-1 border-t border-(--light-gray) pt-2 text-[8px] md:space-y-1.5 md:pt-3 md:text-sm">
				{note.trim() ? (
					<div className="flex justify-between gap-2">
						<span style={{ color: "var(--medium-gray)" }}>Note</span>
						<span
							className="max-w-[60%] text-right font-medium"
							style={{ color: "var(--dark-gray)" }}
						>
							{note}
						</span>
					</div>
				) : null}
				<div className="flex justify-between gap-2">
					<span style={{ color: "var(--medium-gray)" }}>Payment</span>
					<span className="font-medium" style={{ color: "var(--dark-gray)" }}>
						{paymentLabels[paymentMethod]}
					</span>
				</div>
				{paymentMethod === "CASH" ? (
					<>
						<div className="flex justify-between gap-2">
							<span style={{ color: "var(--medium-gray)" }}>Amount Paid</span>
							<span className="font-medium" style={{ color: "var(--dark-gray)" }}>
								{formatPeso(paidNum)}
							</span>
						</div>
						<div className="flex justify-between gap-2">
							<span style={{ color: "var(--medium-gray)" }}>Change</span>
							<span className="font-bold" style={{ color: "var(--deep-forest)" }}>
								{formatPeso(change)}
							</span>
						</div>
					</>
				) : null}
				{(paymentMethod === "GCASH" || paymentMethod === "GRAB") &&
				referenceNumber.trim() ? (
					<div className="flex justify-between gap-2">
						<span style={{ color: "var(--medium-gray)" }}>Reference</span>
						<span className="font-medium" style={{ color: "var(--dark-gray)" }}>
							{referenceNumber}
						</span>
					</div>
				) : null}
				<div
					className="flex justify-between gap-2 border-t border-(--light-gray) pt-1.5 md:pt-2"
					style={{ color: "var(--deep-forest)" }}
				>
					<span className="text-[9px] font-bold md:text-base">Grand Total</span>
					<span className="text-[9px] font-black md:text-base">
						{formatPeso(total)}
					</span>
				</div>
			</div>
		</div>
	);
}
