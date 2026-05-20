import {
	ArrowRight,
	Coffee,
	CurrencyDollar,
	Hash,
	Minus,
	Plus,
	Trash,
	X,
} from "@phosphor-icons/react";
import { formatPeso } from "@/lib/format-currency";
import type { CartItem } from "../types";
import { formatCupLine } from "../utils";

interface PosCartPanelProps {
	cart: CartItem[];
	form: any;
	onRemoveFromCart: (lineKey: string) => void;
	onUpdateQuantity: (lineKey: string, delta: number) => void;
	onClearCart: () => void;
	onPlaceOrderClick: () => void;
}

export function PosCartPanel({
	cart,
	form,
	onRemoveFromCart,
	onUpdateQuantity,
	onClearCart,
	
}: PosCartPanelProps) {
	const lineSubtotal = cart.reduce((s, c) => s + c.total_price, 0);
	const cartTotal = lineSubtotal;

	const values = form.state.values;
	const paymentMethod = values.paymentMethod;
	const amountPaid = values.amountPaid;

	const paidNum = parseFloat(amountPaid) || 0;
	const isGrab = paymentMethod === "GRAB";

	return (
		<div
			className="flex w-96 shrink-0 flex-col"
			style={{ background: "white", borderLeft: "1px solid var(--light-gray)" }}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-1 flex-col overflow-hidden p-5"
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
						<button
							type="button"
							onClick={onClearCart}
							className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
						>
							<Trash className="size-4" style={{ color: "var(--coral)" }} />
						</button>
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
										<Coffee
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
											{item.discount && item.discount !== "none" ? (
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
												+ {item.addon_items.map((a) => `${a.name} x${a.quantity}`).join(", ")}
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
										<button
											type="button"
											onClick={() =>
												item.quantity === 1
													? onRemoveFromCart(item.lineKey)
													: onUpdateQuantity(item.lineKey, -1)
											}
											className="flex size-7 items-center justify-center rounded-full transition-colors"
											style={{ background: "var(--light-gray)" }}
										>
											{item.quantity === 1 ? (
												<X className="size-3" />
											) : (
												<Minus className="size-3" />
											)}
										</button>
										<span className="w-5 text-center text-xs font-bold">
											{item.quantity}
										</span>
										<button
											type="button"
											onClick={() => onUpdateQuantity(item.lineKey, 1)}
											className="flex size-7 items-center justify-center rounded-full"
											style={{ background: "var(--deep-forest)" }}
										>
											<Plus className="size-3 text-white" />
										</button>
									</div>
							</div>
						);
					})}

					{cart.length === 0 ? (
						<div className="flex h-32 flex-col items-center justify-center">
							<Coffee
								className="mb-2 size-8"
								style={{ color: "var(--light-gray)" }}
							/>
							<p className="text-xs" style={{ color: "var(--medium-gray)" }}>
								Cart is empty
							</p>
						</div>
					) : null}
				</div>

				{/* Note */}
				{cart.length > 0 ? (
					<form.AppField name="note">
						{(field: any) => (
							<div className="mb-3">
								<input
									type="text"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Add a note..."
									className="h-9 w-full rounded-lg border px-3 text-xs outline-none"
									style={{
										background: "var(--off-white)",
										borderColor: "var(--light-gray)",
									}}
								/>
							</div>
						)}
					</form.AppField>
				) : null}

				{/* Payment */}
				{cart.length > 0 ? (
					<div className="mb-4 space-y-4">
						<form.AppField name="paymentMethod">
							{(field: any) => (
								<div>
									<label
										className="mb-1.5 block text-xs font-medium"
										style={{ color: "var(--medium-gray)" }}
									>
										Payment Method
									</label>
									<div className="flex gap-2">
										{(
											[
												{ key: "CASH" as const, label: "Cash" },
												{ key: "GCASH" as const, label: "GCash" },
												{ key: "GRAB" as const, label: "Grab" },
											] as const
										).map((p) => (
											<button
												key={p.key}
												type="button"
												onClick={() => {
													field.handleChange(p.key);
													form.setFieldValue("amountPaid", "");
													form.setFieldValue("referenceNumber", "");
												}}
												className="flex-1 rounded-xl py-2 text-xs font-semibold transition-all"
												style={{
													background:
														field.state.value === p.key
															? "var(--deep-forest)"
															: "var(--off-white)",
													color:
														field.state.value === p.key
															? "white"
															: "var(--dark-gray)",
												}}
											>
												{p.label}
											</button>
										))}
									</div>
								</div>
							)}
						</form.AppField>

						<div className="space-y-3">
							{paymentMethod !== "GRAB" ? (
								<form.AppField name="amountPaid">
									{(field: any) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<div>
												<label
													className="mb-1.5 block text-xs font-medium"
													style={{ color: "var(--medium-gray)" }}
												>
													Amount Paid
												</label>
												<div className="relative">
													<CurrencyDollar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
													<input
														type="number"
														step="0.01"
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder="0.00"
														className={`h-10 w-full rounded-xl border pr-3 pl-9 text-sm font-bold outline-none`}
														style={{
															background: "var(--off-white)",
															borderColor: isInvalid ? "red" : "var(--light-gray)",
															color: "var(--deep-forest)",
														}}
													/>
												</div>
												{isInvalid && (
													<p className="mt-1 text-[10px] text-red-500 font-medium">
														{field.state.meta.errors?.[0]?.message || field.state.meta.errors?.[0]}
													</p>
												)}
											</div>
										);
									}}
								</form.AppField>
							) : null}

							{paymentMethod === "CASH" &&
							!isGrab &&
							amountPaid &&
							paidNum >= cartTotal ? (
								<div
									className="flex items-center justify-between rounded-xl p-3"
									style={{ background: "var(--deep-forest)", color: "white" }}
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
									{(field: any) => {
										const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<div>
												<label
													className="mb-1.5 block text-xs font-medium"
													style={{ color: "var(--medium-gray)" }}
												>
													Reference Number
												</label>
												<div className="relative">
													<Hash className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
													<input
														type="text"
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder="Ref #"
														className={`h-10 w-full rounded-xl border pr-3 pl-9 text-sm font-bold outline-none`}
														style={{
															background: "var(--off-white)",
															borderColor: isInvalid ? "red" : "var(--light-gray)",
														}}
													/>
												</div>
												{isInvalid && (
													<p className="mt-1 text-[10px] text-red-500 font-medium">
														{field.state.meta.errors?.[0]?.message || field.state.meta.errors?.[0]}
													</p>
												)}
											</div>
										);
									}}
								</form.AppField>
							) : null}
						</div>
					</div>
				) : null}

				{/* Totals */}
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
					<button
						type="submit"
						disabled={cart.length === 0}
						className="btn-primary flex w-full items-center justify-center gap-2"
						style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
					>
						Place Order <ArrowRight className="size-4" />
					</button>
				</form.AppForm>
			</form>
		</div>
	);
}
