import {
	ArrowRightIcon,
	CoffeeIcon,
	MinusIcon,
	PlusIcon,
	TrashIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { formatPeso } from "@/lib/format-currency";
import type { usePosForm } from "../hooks/usePosForm";
import type { CartItem } from "../types";
import { formatCupLine } from "../utils";

interface PosCartPanelProps {
	cart: CartItem[];
	form: ReturnType<typeof usePosForm>;
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
			className="flex w-96 flex-col overflow-hidden p-5 h-full bg-white"
		>
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h2
							className="text-lg font-bold"
							style={{ color: "var(--near-black)" }}
						>
							Current Order
						</h2>
						<p
							className="mt-0.5 text-[10px] font-semibold tracking-wide uppercase"
							style={{ color: "var(--deep-forest)" }}
						>
							Walk-in · All orders
						</p>
					</div>
					{cart.length > 0 ? (
						<Button variant="ghost" size="icon" onClick={onClearCart}>
							<TrashIcon className="size-4" style={{ color: "var(--coral)" }} />
						</Button>
					) : null}
				</div>

				<div className="-mr-1 flex-1 overflow-y-auto pr-1">
					{cart.map((item) => {
						const cupLine = formatCupLine(item.cup_type, item.cup_size);
						return (
							<div
								key={item.lineKey}
								className="mb-2 flex items-center gap-3 rounded-xl p-3"
								style={{ background: "var(--off-white)" }}
							>
								<div
									className="flex size-12 shrink-0 items-center justify-center rounded-lg"
									style={{ background: "var(--light-gray)" }}
								>
									<CoffeeIcon
										className="size-6"
										style={{ color: "var(--medium-gray)" }}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h4
										className="truncate text-sm font-semibold"
										style={{ color: "var(--dark-gray)" }}
									>
										{item.menu_name}
									</h4>
									<div className="mt-0.5 flex flex-wrap gap-1">
										{item.is_free_drink ? (
											<span className="rounded-full bg-green-100 px-2 py-0.5 text-[8px] font-bold text-green-700">
												Free
											</span>
										) : null}
										{item.discount ? (
											<span className="rounded-full bg-blue-100 px-2 py-0.5 text-[8px] font-bold text-blue-700">
												{item.discount === "SENIOR" ? "Senior" : "PWD"} 5%
											</span>
										) : null}
									</div>
									{cupLine ? (
										<p
											className="mt-0.5 text-[10px] font-medium"
											style={{ color: "var(--medium-gray)" }}
										>
											{cupLine}
										</p>
									) : null}
									{item.addon_items && item.addon_items.length > 0 ? (
										<p
											className="text-[9px] font-semibold italic"
											style={{ color: "var(--coral)" }}
										>
											+{" "}
											{item.addon_items
												.map((a) => `${a.name} x${a.quantity}`)
												.join(", ")}
										</p>
									) : null}
									<p
										className="text-sm font-bold"
										style={{ color: "var(--deep-forest)" }}
									>
										{formatPeso(item.total_price)}
									</p>
								</div>
								<div className="flex items-center gap-1.5">
									<Button
										variant="secondary"
										size="icon-xs"
										onClick={() =>
											item.quantity === 1
												? onRemoveFromCart(item.lineKey)
												: onUpdateQuantity(item.lineKey, -1)
										}
									>
										{item.quantity === 1 ? (
											<XIcon className="size-3" />
										) : (
											<MinusIcon className="size-3" />
										)}
									</Button>
									<span className="w-5 text-center text-xs font-bold">
										{item.quantity}
									</span>
									<Button
										variant="default"
										size="icon-xs"
										disabled={
											Boolean(item.discount) || Boolean(item.is_free_drink)
										}
										onClick={() => onUpdateQuantity(item.lineKey, 1)}
									>
										<PlusIcon className="size-3" />
									</Button>
								</div>
							</div>
						);
					})}

					{cart.length === 0 ? (
						<div className="flex h-32 flex-col items-center justify-center">
							<CoffeeIcon
								className="mb-2 size-8"
								style={{ color: "var(--light-gray)" }}
							/>
							<p className="text-xs" style={{ color: "var(--medium-gray)" }}>
								Cart is empty
							</p>
						</div>
					) : null}
				</div>

				{cart.length > 0 ? (
					<div className="mb-4 space-y-4">
						<form.AppField name="note">
							{(field) => (
								<field.Input label="Note" placeholder="Add a note..." />
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
								/>
							)}
						</form.AppField>

						<div className="space-y-3">
							{paymentMethod !== "GRAB" ? (
								<form.AppField name="amountPaid">
									{(field) => (
										<field.NumberField
											label="Amount Paid"
											placeholder="0.00"
											step="0.01"
										/>
									)}
								</form.AppField>
							) : null}

							{paymentMethod === "CASH" &&
							!isGrab &&
							amountPaid &&
							paidNum >= cartTotal ? (
								<div
									className="flex items-center justify-between rounded-xl p-3"
									style={{
										background: "var(--deep-forest)",
										color: "white",
									}}
								>
									<span className="text-xs font-medium opacity-80">
										Change to give
									</span>
									<span className="text-lg font-black">
										{formatPeso(paidNum - cartTotal)}
									</span>
								</div>
							) : null}

							{paymentMethod === "GCASH" || paymentMethod === "GRAB" ? (
								<form.AppField name="referenceNumber">
									{(field) => (
										<field.Input label="Reference Number" placeholder="Ref #" />
									)}
								</form.AppField>
							) : null}
						</div>
					</div>
				) : null}

				{cart.length > 0 && !isGrab ? (
					<div
						className="mb-3 pt-3"
						style={{ borderTop: "1px solid var(--light-gray)" }}
					>
						<div className="flex justify-between">
							<span
								className="text-sm font-bold"
								style={{ color: "var(--near-black)" }}
							>
								Total
							</span>
							<span
								className="text-lg font-bold"
								style={{ color: "var(--deep-forest)" }}
							>
								{formatPeso(cartTotal)}
							</span>
						</div>
					</div>
				) : null}

				<form.AppForm>
					<Button type="submit" disabled={cart.length === 0} className="w-full">
						Place Order <ArrowRightIcon className="size-4" />
					</Button>
				</form.AppForm>
			</form>
	);
}
