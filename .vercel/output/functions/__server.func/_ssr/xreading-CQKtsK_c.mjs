import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { R as s, a as m, v as c } from "../_libs/phosphor-icons__react.mjs";
import { _ as useAppForm } from "./tanstack-form-BSMHRPNr.mjs";
import { a as AlertDialogDescription, i as AlertDialogContent, l as AlertDialogTitle, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { t as formatPeso } from "./format-currency-OpqMVH6X.mjs";
import { _ as printCashCount, a as loadBixolonSDK, i as getOverShort, n as formatReconciliationStatus, r as getExpectedCashInDrawer, t as THERMAL_PAGE_STYLE, y as printSalesXReading } from "./pos-ui-Czx3k4Q7.mjs";
import { t as Z } from "../_libs/react-to-print.mjs";
import { t as PosModal } from "./PosModal-AjEJrogY.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as authClient } from "./auth-client-7rZ5yLYJ.mjs";
import { t as Route } from "./xreading-93DPXxa1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/xreading-CQKtsK_c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyCashCountValues = {
	1: 0,
	5: 0,
	10: 0,
	20: 0,
	50: 0,
	100: 0,
	200: 0,
	500: 0,
	1e3: 0
};
var useXReadingStore = create()(persist((set) => ({
	cashCount: emptyCashCountValues,
	setCashCount: (values) => set({ cashCount: values }),
	setDenom: (denom, qty) => set((state) => ({ cashCount: {
		...state.cashCount,
		[denom]: qty
	} })),
	resetCashCount: () => set({ cashCount: emptyCashCountValues })
}), {
	name: "staff-xreading-cash-count",
	partialize: (state) => ({ cashCount: state.cashCount })
}));
var denominations$1 = [
	1e3,
	500,
	200,
	100,
	50,
	20,
	10,
	5,
	1
];
function CashCountPanel({ form, totalCashCounted, onResetClick }) {
	const setDenom = useXReadingStore((state) => state.setDenom);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-2xl border border-(--light-gray) bg-(--pure-white) p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-base font-semibold text-(--deep-forest)",
				children: "Cash Count"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 space-y-2",
				children: denominations$1.map((denom) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-(--light-gray)/50 bg-gray-50/50 p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-20 items-center justify-center rounded-lg bg-(--deep-forest) py-1.5 font-mono text-sm font-medium text-(--pale-yellow)",
							children: ["₱", denom]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-(--medium-gray)",
								children: "Qty"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: denom.toString(),
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: field.name,
									type: "number",
									min: "0",
									value: field.state.value === 0 ? "" : field.state.value,
									onChange: (e) => {
										if (e.target.value === "") {
											field.handleChange(0);
											setDenom(denom, 0);
											return;
										}
										const val = parseInt(e.target.value, 10);
										const qty = isNaN(val) || val < 0 ? 0 : val;
										field.handleChange(qty);
										setDenom(denom, qty);
									},
									className: "w-16 rounded-lg border border-(--light-gray) bg-white px-2 py-1 text-center text-sm font-medium focus:border-(--forest-green) focus:outline-none focus:ring-1 focus:ring-(--forest-green)"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-28 flex-col items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-(--medium-gray)",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
								selector: (state) => (state.values[denom] || 0) * denom,
								children: (total) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs font-medium text-(--deep-forest)",
									children: ["₱", total.toFixed(2)]
								})
							})]
						})
					]
				}, denom))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl bg-(--deep-forest) p-4 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Total Cash Counted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xl font-bold text-(--pale-yellow)",
						children: ["₱", totalCashCounted.toFixed(2)]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onResetClick,
					className: "w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100",
					children: "Reset Cash Count"
				})]
			})
		]
	});
}
function SummaryCard({ label, value, valueClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-(--light-gray) bg-(--pure-white) p-3 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-0.5 text-xs font-medium text-(--medium-gray)",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `font-mono text-xl font-bold ${valueClassName ?? "text-(--deep-forest)"}`,
			children: value
		})]
	});
}
function ReconciliationPanel({ totals, totalCashCounted, onExportSales, onExportCashCount }) {
	const { overShort } = getOverShort(totalCashCounted, totals);
	const { isMatched, isOver } = formatReconciliationStatus(overShort);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
				label: "Total Cash In",
				value: formatPeso(totals.totalCashIn)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
				label: "Total Sales",
				value: formatPeso(totals.totalCashSales)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
				label: "Expenses",
				value: formatPeso(totals.totalCashOut),
				valueClassName: "text-(--coral)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-(--light-gray) bg-(--pure-white) p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-1 text-xs font-medium text-(--medium-gray)",
						children: "Discrepancy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `font-mono text-2xl font-bold ${isMatched ? "text-(--forest-green)" : isOver ? "text-(--forest-green)" : "text-(--coral)"}`,
							children: [overShort > 0 ? "+" : "", formatPeso(overShort)]
						}), isMatched ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
							weight: "fill",
							className: "size-6 text-(--forest-green)"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
							weight: "fill",
							className: `size-6 ${isOver ? "text-(--forest-green)" : "text-(--coral)"}`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-(--medium-gray)",
						children: isMatched ? "Cash count matches." : isOver ? "Over — counted more than expected." : "Short — counted less than expected."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onExportSales,
					className: "flex w-full items-center justify-center gap-2 rounded-xl bg-(--deep-forest) px-3 py-3 text-sm font-medium text-(--pale-yellow) transition-colors hover:bg-(--forest-green)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
						weight: "bold",
						className: "size-4"
					}), "Print Sales X-Reading"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onExportCashCount,
					className: "flex w-full items-center justify-center gap-2 rounded-xl border border-(--deep-forest) px-3 py-3 text-sm font-medium text-(--deep-forest) transition-colors hover:bg-(--pale-yellow)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
						weight: "bold",
						className: "size-4"
					}), "Print Cash Count"]
				})]
			})
		]
	});
}
var denominations = [
	1e3,
	500,
	200,
	100,
	50,
	20,
	10,
	5,
	1
];
function XReadingReceiptDialog({ open, onClose, mode, staffName, totals, totalCashCounted, cashCount }) {
	const contentRef = (0, import_react.useRef)(null);
	const [bixolonReady, setBixolonReady] = (0, import_react.useState)(false);
	const [bixolonLoading, setBixolonLoading] = (0, import_react.useState)(false);
	const handlePrint = Z({
		contentRef,
		pageStyle: THERMAL_PAGE_STYLE,
		onAfterPrint: onClose
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setBixolonLoading(true);
		loadBixolonSDK().then((loaded) => {
			setBixolonReady(loaded);
		}).catch(() => {
			setBixolonReady(false);
		}).finally(() => {
			setBixolonLoading(false);
		});
	}, [open]);
	const handleDirectPrint = () => {
		try {
			if (mode === "sales") printSalesXReading(staffName, totals, totalCashCounted);
			else if (mode === "cashcount") printCashCount(staffName, cashCount, totalCashCounted);
			onClose();
		} catch (err) {
			console.error("BIXOLON direct print failed:", err);
		}
	};
	if (!mode) return null;
	const { totalCashSales, totalCashOut, totalCashIn } = totals;
	const grossSales = totalCashSales + totalCashIn;
	const netSales = getExpectedCashInDrawer(totals);
	const { overShort } = getOverShort(totalCashCounted, totals);
	const targetDate = /* @__PURE__ */ new Date();
	const displayDate = targetDate.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric"
	});
	const displayDateTime = targetDate.toLocaleString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PosModal, {
		open,
		onClose,
		showClose: true,
		className: "max-w-[380px] p-4 sm:p-8",
		overlayClassName: "overflow-y-auto no-print",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: contentRef,
				id: "receipt-content",
				className: "receipt-thermal font-mono text-[#1a1a1a] select-none",
				children: [mode === "sales" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "sales-xreading-receipt",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black tracking-tight",
								children: "48 COFFEE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold uppercase tracking-widest",
								children: "SALES X-READING"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 text-[11px] font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sales Date :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayDate })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cashier :" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: staffName })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-4 border-t-2 border-dashed border-black pt-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-bold space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL CASH IN:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totalCashIn.toFixed(2) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL SALES:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totalCashSales.toFixed(2) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-dashed border-black pt-4 text-[11px] font-bold space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GROSS SALES:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: grossSales.toFixed(2) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL PICKUP:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totalCashOut.toFixed(2) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t-2 border-dashed border-black pt-4 text-[11px] font-bold space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NET SALES:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: netSales.toFixed(2) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CASH COUNT:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totalCashCounted.toFixed(2) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OVER / SHORT:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [overShort > 0 ? "+" : "", overShort.toFixed(2)] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-12 text-center text-[11px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-t-2 border-dashed border-black pt-2",
								children: "Signature of Cashier"
							})
						})
					]
				}), mode === "cashcount" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "cash-count-receipt",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-black tracking-tight",
									children: "48 COFFEE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-0.5 text-lg font-bold uppercase",
									children: "CASH COUNT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm mt-2",
									children: ["Date: ", displayDateTime]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm",
									children: ["Cashier: ", staffName]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 border-t border-dashed border-black pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
								className: "w-full text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: denominations.map((denom) => {
									const qty = cashCount[denom] || 0;
									if (qty === 0) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-1",
											children: ["₱", denom]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-1 text-center",
											children: ["x", qty]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-1 text-right",
											children: (denom * qty).toFixed(2)
										})
									] }, denom);
								}) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-dashed border-black pt-4 text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totalCashCounted.toFixed(2) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-12 text-center text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "border-t border-dashed border-black pt-2",
								children: "Signature of Cashier"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print mt-8 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "h-12 flex-1 rounded-xl border-2 text-sm font-bold transition-all hover:bg-gray-50 active:scale-95",
						style: {
							borderColor: "var(--near-black)",
							color: "var(--near-black)"
						},
						children: "Save"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handlePrint(),
						className: "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95",
						style: { background: "var(--near-black)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { className: "size-4" }), " Print"]
					})]
				}), bixolonReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleDirectPrint,
					className: "flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 text-xs font-bold transition-all hover:bg-gray-50 active:scale-95",
					style: {
						borderColor: "var(--near-black)",
						color: "var(--near-black)"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, { className: "size-3.5" }), " Direct Print (BIXOLON)"]
				}) : bixolonLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: true,
					className: "flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 text-xs font-bold opacity-50 transition-all",
					style: {
						borderColor: "var(--near-black)",
						color: "var(--near-black)"
					},
					children: "Detecting printer..."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
				.receipt-thermal {
					font-family: 'Courier New', Courier, monospace;
					line-height: 1.2;
				}
			` })
		]
	});
}
function XReadingScreen({ data }) {
	const { data: session } = authClient.useSession();
	const staffName = session?.user?.name || "Staff";
	const cashCount = useXReadingStore((state) => state.cashCount);
	const resetCashCount = useXReadingStore((state) => state.resetCashCount);
	const [showResetModal, setShowResetModal] = (0, import_react.useState)(false);
	const [receiptMode, setReceiptMode] = (0, import_react.useState)(null);
	const form = useAppForm({ defaultValues: cashCount });
	(0, import_react.useEffect)(() => {
		const syncFormFromStore = () => {
			form.reset(useXReadingStore.getState().cashCount);
		};
		syncFormFromStore();
		return useXReadingStore.persist.onFinishHydration(syncFormFromStore);
	}, [form]);
	const totalCashCounted = Object.entries(cashCount).reduce((sum, [denom, qty]) => sum + Number(denom) * qty, 0);
	const handleExportSales = () => {
		setReceiptMode("sales");
	};
	const handleExportCashCount = () => {
		setReceiptMode("cashcount");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 print:hidden lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashCountPanel, {
				form,
				totalCashCounted,
				onResetClick: () => setShowResetModal(true)
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReconciliationPanel, {
				totals: {
					totalCashSales: data.totalCashSales,
					totalCashOut: data.totalCashOut,
					totalCashIn: data.totalCashIn
				},
				totalCashCounted,
				onExportSales: handleExportSales,
				onExportCashCount: handleExportCashCount
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
			open: showResetModal,
			onOpenChange: setShowResetModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Reset Cash Count?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This will clear all denomination counts. Saved counts will be removed from this device." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					variant: "destructive",
					onClick: () => {
						resetCashCount();
						form.reset(emptyCashCountValues);
						setShowResetModal(false);
					},
					children: "Reset"
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XReadingReceiptDialog, {
			open: !!receiptMode,
			onClose: () => setReceiptMode(null),
			mode: receiptMode,
			staffName,
			totals: {
				totalCashSales: data.totalCashSales,
				totalCashOut: data.totalCashOut,
				totalCashIn: data.totalCashIn
			},
			totalCashCounted,
			cashCount
		})
	] });
}
function StaffXReading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-(--pale-yellow)/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-screen-2xl p-2 sm:p-3 lg:p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XReadingScreen, { data: Route.useLoaderData() })
		})
	});
}
//#endregion
export { StaffXReading as component };
