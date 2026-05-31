import { useState } from "react";
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
	const [isDetailsOpen, setIsDetailsOpen] = useState(true);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="flex h-full w-64 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-l border-(--light-gray) bg-(--pure-white) p-1.5 md:w-80 lg:w-96 md:p-3 lg:p-5 min-h-0"
		>
				<div className="mb-0.5 flex items-center justify-between md:mb-4">
					<div>
						<h2
							className="text-[10px] font-bold md:text-lg"
							style={{ color: "var(--near-black)" }}
						>
							Current Order
						</h2>
						<p
							className="mt-0.5 text-[7px] font-semibold tracking-wide uppercase md:text-[10px]"
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
							<TrashIcon
								className="size-2 md:size-4"
								style={{ color: "var(--coral)" }}
							/>
						</Button>
					) : null}
				</div>

				<div className="-mr-1 flex-1 overflow-y-auto pr-1 min-h-[40px] md:min-h-[60px]">
					{cart.map((item) => {
						const cupLine = formatCupLine(item.cup_type, item.cup_size);
						return (
							<div
								key={item.lineKey}
								className="mb-0.5 flex items-center gap-1 rounded-[5px] p-1 md:mb-2 md:gap-2 lg:gap-3 md:rounded-lg lg:rounded-xl md:p-2 lg:p-3"
								style={{ background: "var(--off-white)" }}
							>
								<div className="min-w-0 flex-1 pl-1.5 md:pl-2">
									<h4
										className="truncate text-[11px] font-bold md:text-sm"
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
											className="mt-0.5 text-[10px] font-medium md:text-[12px]"
											style={{ color: "var(--medium-gray)" }}
										>
											{cupLine}
										</p>
									) : null}
									{item.addon_items && item.addon_items.length > 0 ? (
										<p
											className="text-[10px] font-semibold italic md:text-[11px]"
											style={{ color: "var(--coral)" }}
										>
											+{" "}
											{item.addon_items
												.map((a) => `${a.name} x${a.quantity}`)
												.join(", ")}
										</p>
									) : null}
									<p
										className="text-[11px] font-bold md:text-sm"
										style={{ color: "var(--deep-forest)" }}
									>
										{formatPeso(item.total_price)}
									</p>
								</div>
								<div className="flex items-center gap-px md:gap-1.5">
									<Button
										variant="secondary"
										className={cn("h-5 w-5 min-w-0 p-0 rounded-[3px] md:size-7", posBtnSecondary)}
										onClick={() =>
											item.quantity === 1
												? onRemoveFromCart(item.lineKey)
												: onUpdateQuantity(item.lineKey, -1)
										}
									>
										{item.quantity === 1 ? (
											<XIcon className="size-2 md:size-3.5" />
										) : (
											<MinusIcon className="size-2 md:size-3.5" />
										)}
									</Button>
									<span className="w-2 text-center text-[6px] font-bold md:w-5 md:text-xs">
										{item.quantity}
									</span>
									<Button
										variant="default"
										className={cn("h-5 w-5 min-w-0 p-0 rounded-[3px] md:size-7", posBtnPrimary)}
										disabled={
											Boolean(item.discount) || Boolean(item.is_free_drink)
										}
										onClick={() => onUpdateQuantity(item.lineKey, 1)}
									>
										<PlusIcon className="size-2 md:size-3.5" />
									</Button>
								</div>
							</div>
						);
					})}

					{cart.length === 0 ? (
						<div className="flex h-12 flex-col items-center justify-center md:h-32">
							<CoffeeIcon
								className="mb-1 size-4 md:mb-2 md:size-8"
								style={{ color: "var(--light-gray)" }}
							/>
							<p className="text-[7px] md:text-xs" style={{ color: "var(--medium-gray)" }}>
								Cart is empty
							</p>
						</div>
					) : null}

				</div>

				{cart.length > 0 ? (
					<div className="shrink-0">
						<div className="flex justify-end mt-3 -mb-2">
							<Button
								variant="ghost"
								className={cn(
									"h-4 px-1.5 text-[13px] md:h-6 md:px-2 md:text-[13px]",
									posBtnGhost,
								)}
								aria-expanded={isDetailsOpen}
								onClick={() => setIsDetailsOpen((open) => !open)}
							>
								Details
								<ArrowRightIcon
									className={cn(
										"ml-1 size-2 transition-transform md:size-3",
										isDetailsOpen ? "rotate-90" : "rotate-0",
									)}
								/>
							</Button>
						</div>
						<div
							className={cn(
								"transform-gpu overflow-hidden transition-all duration-200",
								isDetailsOpen
									? "mt-1 max-h-[420px] translate-x-0 pb-1 pt-1 opacity-100 md:mt-2 md:pb-1 md:pt-2 lg:mt-3 lg:pb-2 lg:pt-3"
									: "mt-0 max-h-0 translate-x-2 pb-0 pt-0 opacity-0 pointer-events-none",
							)}
							aria-hidden={!isDetailsOpen}
						>
							<div className="border-t border-(--light-gray) pt-1.5 space-y-2 md:pt-2 md:space-y-2 lg:space-y-3 [&_[data-slot=field]]:gap-0.5 md:[&_[data-slot=field]]:gap-1 lg:[&_[data-slot=field]]:gap-2 [&_[data-slot=field-label]]:text-[7px] md:[&_[data-slot=field-label]]:text-[9px] lg:[&_[data-slot=field-label]]:text-xs">
						<div className="grid grid-cols-2 gap-x-1 gap-y-1 md:gap-x-2 md:gap-y-1.5 lg:gap-y-2 items-start">
							<div className="col-span-2">
								<form.AppField name="note">
									{(field) => (
										<field.Input label="Note" placeholder="Add a note..." className="h-5 md:h-7 lg:h-9 rounded-[5px] md:rounded-md text-[8px] md:text-[10px] lg:text-sm" />
									)}
								</form.AppField>
							</div>

							<div className="col-span-1">
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
											className="!h-5 md:!h-7 lg:!h-9 rounded-[5px] md:rounded-md text-[8px] md:text-[10px] lg:text-sm w-full py-0 md:py-1 lg:py-1.5"
										/>
									)}
								</form.AppField>
							</div>

							{paymentMethod !== "GRAB" ? (
								<div className="col-span-1">
									<form.AppField name="amountPaid">
										{(field) => (
											<field.Input
												label="Amount Paid"
												placeholder="0.00"
												type="number"
												step="0.01"
												min="0"
												className="h-5 md:h-7 lg:h-9 rounded-[5px] md:rounded-md text-[8px] md:text-[10px] lg:text-sm"
											/>
										)}
									</form.AppField>
								</div>
							) : null}

							{paymentMethod === "GCASH" || paymentMethod === "GRAB" ? (
								<div className="col-span-2">
									<form.AppField name="referenceNumber">
										{(field) => (
											<field.Input label="Reference Number" placeholder="Ref #" className="h-5 md:h-7 lg:h-9 rounded-[5px] md:rounded-md text-[8px] md:text-[10px] lg:text-sm" />
										)}
									</form.AppField>
								</div>
							) : null}
						</div>

								{paymentMethod === "CASH" && !isGrab && amountPaid && paidNum >= cartTotal ? (
									<div
										className="mt-0.5 flex items-center justify-between rounded-[5px] p-1 md:mt-1 md:rounded-lg lg:mt-1.5 lg:rounded-xl md:p-1.5 lg:p-2"
										style={{
											background: "var(--deep-forest)",
											color: "white",
										}}
									>
										<span className="text-[7px] font-medium opacity-80 md:text-[9px] lg:text-xs">
											Change
										</span>
										<span className="text-[8px] font-black md:text-sm lg:text-lg">
											{formatPeso(paidNum - cartTotal)}
										</span>
									</div>
								) : null}
							</div>
						</div>
					</div>
				) : null}

				{cart.length > 0 ? (
					<div
						className="mt-0.5 pt-0.5 md:mt-1 md:pt-1 lg:mt-2 lg:pt-2 shrink-0 flex items-center justify-between gap-2"
						style={{ borderTop: "1px solid var(--light-gray)" }}
					>
						<div className="flex flex-col justify-center">
							<span
								className="text-[7px] font-bold md:text-[9px] lg:text-xs"
								style={{ color: "var(--near-black)" }}
							>
								Total
							</span>
							<span
								className="text-[8px] font-black md:text-[13px] lg:text-lg leading-tight"
								style={{ color: "var(--deep-forest)" }}
							>
								{formatPeso(cartTotal)}
							</span>
						</div>

						<div className="flex-1 max-w-[60%]">
							<form.AppForm>
								<Button
									type="submit"
									disabled={cart.length === 0 || isPlacingOrder}
									className={cn("w-full h-6 rounded-[5px] text-[8px] md:h-8 lg:h-10 md:rounded-lg lg:rounded-xl md:text-[10px] lg:text-sm", posBtnPrimary)}
								>
									{isPlacingOrder ? (
										<>
											<SpinnerIcon className="size-2 animate-spin md:size-4" />
											Placing...
										</>
									) : (
										<>
											Place Order <ArrowRightIcon className="size-2 md:size-4" />
										</>
									)}
								</Button>
							</form.AppForm>
						</div>
					</div>
				) : null}
			</form>
	);
}
