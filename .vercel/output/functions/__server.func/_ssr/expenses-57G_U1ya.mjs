import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware } from "./middlewares-D1Pk677b.mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { K as r, M as o, W as r$1, i as e } from "../_libs/phosphor-icons__react.mjs";
import { _ as useAppForm, u as Label } from "./tanstack-form-BSMHRPNr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { a as useQuery, n as useMutation, t as mutationOptions } from "../_libs/tanstack__react-query.mjs";
import { r as createColumnHelper } from "../_libs/@tanstack/react-table+[...].mjs";
import { t as DataTable } from "./data-table-BquxqQ2A.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as CreateExpenseSchema } from "./expense-BLoeC-sS.mjs";
import { n as getExpensesQueryOptions, t as expenseKeys } from "./queryOptions-BPXkmGKa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-57G_U1ya.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createExpense = createServerFn({ method: "POST" }).middleware([authMiddleware]).inputValidator(CreateExpenseSchema).handler(createSsrRpc("4f518719f95035ad87314f7bf1849aaf262dcbdcd3e412c455d0ac112730da3f"));
var createExpenseMutationOptions = mutationOptions({
	mutationFn: async (data) => createExpense({ data }),
	onSuccess: (newExpense, variables, _onMutateResult, context) => {
		for (const timeframe of ["today", "yesterday"]) context.client.setQueryData(expenseKeys.all(timeframe), (old) => {
			if (!old) return [newExpense];
			return [newExpense, ...old];
		});
		const label = variables.type === "CASH_IN" ? "Cash in" : "Cash out";
		toast.success(`${label} recorded`, { description: `${variables.description}` });
	},
	onError: (error) => {
		toast.error("Failed to record expense", { description: error?.message ?? "Unknown error" });
	}
});
function AddExpenseForm() {
	const mutation = useMutation(createExpenseMutationOptions);
	const form = useAppForm({
		defaultValues: {
			type: "CASH_OUT",
			description: "",
			amount: 0
		},
		validators: { onSubmit: CreateExpenseSchema },
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
			form.reset();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			form.handleSubmit();
		},
		className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "type",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-lg font-semibold text-(--deep-forest)",
					children: field.state.value === "CASH_IN" ? "Add Cash In" : "Add Cash Out"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block text-sm font-medium text-(--deep-forest)",
						children: "Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => field.handleChange("CASH_OUT"),
							className: cn("flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all", field.state.value === "CASH_OUT" ? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)" : "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, {
								weight: "bold",
								className: "size-4"
							}), "Cash Out"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => field.handleChange("CASH_IN"),
							className: cn("flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all", field.state.value === "CASH_IN" ? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)" : "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, {
								weight: "bold",
								className: "size-4"
							}), "Cash In"]
						})]
					})]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "description",
				listeners: { onChange: ({ fieldApi, value }) => {
					if (value.length >= 50) fieldApi.setValue(value.slice(0, 50));
				} },
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, { label: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-1 text-right text-xs", field.state.value.length >= 45 ? "text-red-600" : "text-(--medium-gray)"),
					children: [field.state.value.length, " / 50"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "amount",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.NumberField, {
					label: "Amount",
					placeholder: "0.00"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
				selector: (s) => s.values.type,
				children: (type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppForm, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.SubmitButton, {
					label: type === "CASH_IN" ? "Record Cash In" : "Record Cash Out",
					className: "w-full"
				}) })
			})
		]
	});
}
var columnHelper = createColumnHelper();
var columns = [
	columnHelper.accessor("type", {
		header: "Type",
		cell: ({ getValue }) => {
			const isCashIn = getValue() === "CASH_IN";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide", isCashIn ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" : "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"),
				children: [isCashIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, {
					weight: "bold",
					className: "size-3"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, {
					weight: "bold",
					className: "size-3"
				}), isCashIn ? "Cash In" : "Cash Out"]
			});
		}
	}),
	columnHelper.accessor("description", {
		header: "Description",
		cell: ({ getValue }) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-(--deep-forest)",
				children: getValue()
			});
		}
	}),
	columnHelper.accessor("amount", {
		header: "Amount",
		cell: ({ getValue }) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-semibold tabular-nums tracking-tight",
				children: ["₱", getValue().toFixed(2)]
			});
		}
	}),
	columnHelper.accessor("staff_name", {
		header: "Added By",
		cell: ({ getValue }) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-(--medium-gray)",
				children: getValue()
			});
		}
	}),
	columnHelper.accessor("timestamp", {
		header: "Date & Time",
		cell: ({ getValue }) => {
			const ts = getValue();
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-(--medium-gray) text-xs",
				children: new Date(ts).toLocaleString("en-PH", {
					month: "short",
					day: "numeric",
					year: "numeric",
					hour: "numeric",
					minute: "2-digit",
					hour12: true
				})
			});
		}
	})
];
function ExpensesTable() {
	const [timeframe, setTimeframe] = (0, import_react.useState)("today");
	const { data: expenses, isLoading, isError, error, refetch } = useQuery(getExpensesQueryOptions(timeframe));
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
					weight: "fill",
					className: "size-10 text-(--error)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-semibold text-(--deep-forest)",
					children: "Failed to load expenses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-(--medium-gray)",
					children: error?.message ?? "Something went wrong"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					onClick: () => refetch(),
					variant: "outline",
					size: "sm",
					children: "Retry"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-(--light-gray) bg-(--pure-white)",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-(--light-gray) px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-8 items-center justify-center rounded-lg bg-(--deep-forest)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
						weight: "fill",
						className: "size-4 text-(--pale-yellow)"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-(--deep-forest)",
					children: "Cash Records"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-(--medium-gray)",
					children: "Loading..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-(--medium-gray)",
					children: [
						expenses?.length ?? 0,
						" ",
						(expenses?.length ?? 0) === 1 ? "entry" : "entries"
					]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTimeframe("today"),
					className: cn("rounded-full px-4 py-1.5 text-xs font-medium transition-colors", timeframe === "today" ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--medium-gray) hover:bg-(--light-gray)/50"),
					children: "Today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTimeframe("yesterday"),
					className: cn("rounded-full px-4 py-1.5 text-xs font-medium transition-colors", timeframe === "yesterday" ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--medium-gray) hover:bg-(--light-gray)/50"),
					children: "Yesterday"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-2",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns,
				data: expenses ?? [],
				pageSize: 9999
			})
		})]
	});
}
function StaffExpenses() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesTable, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddExpenseForm, {}) })]
			})
		})
	});
}
//#endregion
export { StaffExpenses as component };
