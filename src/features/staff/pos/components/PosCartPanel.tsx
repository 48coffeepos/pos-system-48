import {
	ArrowRightIcon,
	CoffeeIcon,
	MinusIcon,
	PlusIcon,
	SpinnerIcon,
	TrashIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPeso } from "@/lib/format-currency";
import type { usePosForm } from "../hooks/usePosForm";
import {
	posBadgeDiscount,
	posBadgeFree,
	posBtnGhost,
	posBtnPrimary,
	posBtnSecondary,
} from "../pos-ui";
import type { CartItem } from "../types";
import { formatCupLine } from "../utils";

interface PosCartPanelProps {
	cart: CartItem[];
	form: ReturnType<typeof usePosForm>;
	isPlacingOrder?: boolean;
	onRemoveFromCart: (lineKey: string) => void;
	onUpdateQuantity: (lineKey: string, delta: number) => void;
	onClearCart: () => void;
}

const paymentOptions = [
	{ value: "CASH" as const, label: "Cash" },
	{ value: "GCASH" as const, label: "GCash" },
	{ value: "GRAB" as const, label: "Grab" },
];

export function PosCartPanel({
	cart,
	form,
	isPlacingOrder = false,
	onRemoveFromCart,
	onUpdateQuantity,
	onClearCart,
}: PosCartPanelProps) {
	const paymentMethod = useStore(
		form.store,
		(state) => state.values.paymentMethod,
	);
	const amountPaid = useStore(form.store, (state) => state.values.amountPaid);
	const paidNum = parseFloat(amountPaid) || 0;
	const isGrab = paymentMethod === "GRAB";
	const lineSubtotal = cart.reduce((s, c) => s + c.total_price, 0);
	const cartTotal = lineSubtotal;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="flex h-full w-64 shrink-0 flex-col overflow-hidden border-l border-(--light-gray) bg-(--pure-white) p-1.5 lg:w-96 lg:p-5"
		>
				<div className="mb-0.5 flex items-center justify-between lg:mb-4">
					<div>
						<h2
							className="text-[10px] font-bold lg:text-lg"
							style={{ color: "var(--near-black)" }}
						>
							Current Order
						</h2>
						<p
							className="mt-0.5 text-[7px] font-semibold tracking-wide uppercase lg:text-[10px]"
							style={{ color: "var(--deep-forest)" }}
						>
							Walk-in · All orders
						</p>
					</div>
					{cart.length > 0 ? (
						<Button
							variant="ghost"
							size="icon"
							className={posBtnGhost}
							onClick={onClearCart}
						>
							<TrashIcon className="size-2 lg:size-4" style={{ color: "var(--coral)" }} />
						</Button>
					) : null}
				</div>

				<div className="-mr-1 flex-1 overflow-y-auto pr-1">
					{cart.map((item) => {
						const cupLine = formatCupLine(item.cup_type, item.cup_size);
						return (
							<div
								key={item.lineKey}
								className="mb-0.5 flex items-center gap-1 rounded-[5px] p-1 lg:mb-2 lg:gap-3 lg:rounded-xl lg:p-3"
								style={{ background: "var(--off-white)" }}
							>
								<div
									className="flex size-6 shrink-0 items-center justify-center rounded-[5px] lg:size-12 lg:rounded-lg"
									style={{ background: "var(--light-gray)" }}
								>
									<CoffeeIcon
										className="size-3.5 lg:size-6"
										style={{ color: "var(--medium-gray)" }}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h4
										className="truncate text-[9px] font-semibold lg:text-sm"
										style={{ color: "var(--dark-gray)" }}
									>
										{item.menu_name}
									</h4>
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
											className="mt-0.5 text-[7px] font-medium lg:text-[10px]"
											style={{ color: "var(--medium-gray)" }}
										>
											{cupLine}
										</p>
									) : null}
									{item.addon_items && item.addon_items.length > 0 ? (
										<p
											className="text-[7px] font-semibold italic lg:text-[9px]"
											style={{ color: "var(--coral)" }}
										>
											+{" "}
											{item.addon_items
												.map((a) => `${a.name} x${a.quantity}`)
												.join(", ")}
										</p>
									) : null}
									<p
										className="text-[9px] font-bold lg:text-sm"
										style={{ color: "var(--deep-forest)" }}
									>
										{formatPeso(item.total_price)}
									</p>
								</div>
								<div className="flex items-center gap-px lg:gap-1.5">
									<Button
										variant="secondary"
										className={cn("h-3.5 w-3.5 min-w-0 p-0 rounded-[3px] lg:size-6", posBtnSecondary)}
										onClick={() =>
											item.quantity === 1
												? onRemoveFromCart(item.lineKey)
												: onUpdateQuantity(item.lineKey, -1)
										}
									>
										{item.quantity === 1 ? (
											<XIcon className="size-1 lg:size-3" />
										) : (
											<MinusIcon className="size-1 lg:size-3" />
										)}
									</Button>
									<span className="w-2 text-center text-[6px] font-bold lg:w-5 lg:text-xs">
										{item.quantity}
									</span>
									<Button
										variant="default"
										className={cn("h-3.5 w-3.5 min-w-0 p-0 rounded-[3px] lg:size-6", posBtnPrimary)}
										disabled={
											Boolean(item.discount) || Boolean(item.is_free_drink)
										}
										onClick={() => onUpdateQuantity(item.lineKey, 1)}
									>
										<PlusIcon className="size-1 lg:size-3" />
									</Button>
								</div>
							</div>
						);
					})}

					{cart.length === 0 ? (
						<div className="flex h-12 flex-col items-center justify-center lg:h-32">
							<CoffeeIcon
								className="mb-1 size-4 lg:mb-2 lg:size-8"
								style={{ color: "var(--light-gray)" }}
							/>
							<p className="text-[7px] lg:text-xs" style={{ color: "var(--medium-gray)" }}>
								Cart is empty
							</p>
						</div>
					) : null}
				</div>

				{cart.length > 0 ? (
					<div className="mb-0.5 space-y-0.5 lg:mb-4 lg:space-y-4 [&_[data-slot=field]]:gap-0.5 lg:[&_[data-slot=field]]:gap-3 [&_[data-slot=field-label]]:text-[7px] lg:[&_[data-slot=field-label]]:text-sm">
						<form.AppField name="note">
							{(field) => (
								<field.Input label="Note" placeholder="Add a note..." className="h-5 lg:h-9 rounded-[5px] lg:rounded-md text-[8px] md:text-[8px] lg:text-sm" />
							)}
						</form.AppField>

						<form.AppField
							name="paymentMethod"
							listeners={{
								onChange: ({ value }) => {
									if (value === "CASH") {
										form.setFieldValue("referenceNumber", "");
									} else {
										form.setFieldValue("amountPaid", "");
									}
								},
							}}
						>
							{(field) => (
								<field.Select
									label="Payment Method"
									options={paymentOptions}
									placeholder="Select..."
									className="!h-5 lg:!h-9 rounded-[5px] lg:rounded-md text-[8px] lg:text-sm w-full py-0 lg:py-2"
								/>
							)}
						</form.AppField>

						<div className="space-y-0.5 lg:space-y-3">
							{paymentMethod !== "GRAB" ? (
								<form.AppField name="amountPaid">
									{(field) => (
										<field.Input
											label="Amount Paid"
											placeholder="0.00"
											type="number"
											step="0.01"
											min="0"
											className="h-5 lg:h-9 rounded-[5px] lg:rounded-md text-[8px] md:text-[8px] lg:text-sm"
										/>
									)}
								</form.AppField>
							) : null}

							{paymentMethod === "CASH" &&
							!isGrab &&
							amountPaid &&
							paidNum >= cartTotal ? (
								<div
									className="mt-0.5 flex items-center justify-between rounded-[5px] p-1 lg:mt-2 lg:rounded-xl lg:p-3"
									style={{
										background: "var(--deep-forest)",
										color: "white",
									}}
								>
									<span className="text-[7px] font-medium opacity-80 lg:text-xs">
										Change to give
									</span>
									<span className="text-[8px] font-black lg:text-lg">
										{formatPeso(paidNum - cartTotal)}
									</span>
								</div>
							) : null}

							{paymentMethod === "GCASH" || paymentMethod === "GRAB" ? (
								<form.AppField name="referenceNumber">
									{(field) => (
										<field.Input label="Reference Number" placeholder="Ref #" className="h-5 lg:h-9 rounded-[5px] lg:rounded-md text-[8px] md:text-[8px] lg:text-sm" />
									)}
								</form.AppField>
							) : null}
						</div>
					</div>
				) : null}

				{cart.length > 0 && !isGrab ? (
					<div
						className="mb-0.5 pt-0.5 lg:mb-3 lg:pt-3"
						style={{ borderTop: "1px solid var(--light-gray)" }}
					>
						<div className="flex justify-between">
							<span
								className="text-[7px] font-bold lg:text-sm"
								style={{ color: "var(--near-black)" }}
							>
								Total
							</span>
							<span
								className="text-[8px] font-bold lg:text-lg"
								style={{ color: "var(--deep-forest)" }}
							>
								{formatPeso(cartTotal)}
							</span>
						</div>
					</div>
				) : null}

				<form.AppForm>
					<Button
						type="submit"
						disabled={cart.length === 0 || isPlacingOrder}
						className={cn("w-full h-6 rounded-[5px] text-[8px] lg:h-10 lg:rounded-xl lg:text-sm", posBtnPrimary)}
					>
						{isPlacingOrder ? (
							<>
								<SpinnerIcon className="size-2 animate-spin lg:size-4" />
								Placing order...
							</>
						) : (
							<>
								Place Order <ArrowRightIcon className="size-2 lg:size-4" />
							</>
						)}
					</Button>
				</form.AppForm>
			</form>
	);
}
