import { o as __toESM } from "../_runtime.mjs";
import { f as Inventory_Type } from "./auth-BTxLf562.mjs";
import { B as record, F as literal, H as union, L as number, M as boolean, R as object, V as string, j as array, k as _enum } from "../_libs/@better-auth/core+[...].mjs";
import { I as require_jsx_runtime, L as require_react, a as DialogDescription$1, i as DialogPopup, l as DialogRoot, n as DialogTitle$1, o as DialogClose, r as DialogPortal$1, s as DialogBackdrop } from "../_libs/@base-ui/react+[...].mjs";
import { a as revalidateLogic } from "../_libs/@tanstack/form-core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { t as Input$1 } from "./input-fxahDhdL.mjs";
import { B as o, P as o$3, S as e$3, T as o$2, i as e, n as e$1, p as o$1, u as r, y as e$2 } from "../_libs/phosphor-icons__react.mjs";
import { _ as useAppForm, t as Checkbox$1, u as Label } from "./tanstack-form-BSMHRPNr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { a as useQuery, i as useSuspenseQuery, n as useMutation, t as mutationOptions } from "../_libs/tanstack__react-query.mjs";
import { a as AlertDialogDescription, c as AlertDialogMedia, i as AlertDialogContent, l as AlertDialogTitle, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as inventoryKeys } from "./keys-B5wYk-Lf.mjs";
import { t as getAllInventoryQueryOptions } from "./queryOptions-C0OTdcSZ.mjs";
import { t as Fuse } from "../_libs/fuse.js.mjs";
import { i as menuKeys, n as getAllAddOnsQueryOptions, r as getAllMenuQueryOptions, t as addonKeys } from "./queryOptions-DcZgUO8i.mjs";
import { t as formatPeso } from "./format-currency-OpqMVH6X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-yDTs-ZHC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var deleteMenuInput = object({ id: string().min(1) });
var deleteMenu = createServerFn({ method: "POST" }).inputValidator(deleteMenuInput).handler(createSsrRpc("608d02bcdcd65fbe639f1bef25247f6c81199cf7e1941bf514c10bb8426b4434"));
var saveMenuInput = object({
	mode: union([literal("create"), literal("edit")]),
	menuId: string().optional(),
	name: string().trim().min(1).max(200),
	trackInventory: boolean(),
	price: number().positive().optional(),
	itemType: _enum([Inventory_Type.CUP, Inventory_Type.STANDALONE]).optional(),
	selectedCupIds: array(string()),
	cupPrices: record(string(), number()),
	standaloneMode: union([literal("existing"), literal("new")]).optional(),
	selectedInventoryId: string().optional(),
	newInventoryName: string().optional(),
	standalonePrice: number().positive().optional()
});
var saveMenu = createServerFn({ method: "POST" }).inputValidator(saveMenuInput).handler(createSsrRpc("2087b2fb5354eb181d021295ccf683eb151f4f1485ffe0882cb4d86f97894c7b"));
var deleteAddOnInput = object({ id: string().min(1) });
var deleteAddOn = createServerFn({ method: "POST" }).inputValidator(deleteAddOnInput).handler(createSsrRpc("9659e1e3461853dbce3f5d51a5d70fc847db234867665f88c3ea0d1dad71f9dc"));
var UpdateAddOnSchema = object({
	id: string().min(1),
	name: string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
	amount: number({ error: "Amount is required" }).min(0, "Amount must be zero or more")
});
var updateAddOn = createServerFn({ method: "POST" }).inputValidator(UpdateAddOnSchema).handler(createSsrRpc("7926727ea884dccf6e395d2f7f4bba057421aa1ed44b5f21f7b3f0dc90b04d03"));
var CreateAddOnSchema = object({
	name: string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
	amount: number({ error: "Amount is required" }).min(0, "Amount must be zero or more")
});
var createAddOn = createServerFn({ method: "POST" }).inputValidator(CreateAddOnSchema).handler(createSsrRpc("6ba6ab8b1c0f585ad1148b396b724dae6d090541403cc202ecd2224fa06ea2b2"));
var saveMenuMutationOptions = mutationOptions({
	mutationFn: async (data) => saveMenu({ data }),
	onSuccess: async (data, variables, _onMutateResult, mutationContext) => {
		await mutationContext?.client?.invalidateQueries({ queryKey: menuKeys.all });
		if (variables.trackInventory) await mutationContext?.client?.invalidateQueries({ queryKey: inventoryKeys.inventory });
		toast.success(variables.mode === "edit" ? "Menu updated" : "Menu created", { description: `${data.name} was saved successfully.` });
	},
	onError: (error) => {
		toast.error("Failed to save menu item", { description: error?.message ?? "Unknown error" });
	}
});
var deleteMenuMutationOptions = mutationOptions({
	mutationFn: async (data) => deleteMenu({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, mutationContext) => {
		await mutationContext?.client?.invalidateQueries({ queryKey: menuKeys.all });
		toast.success("Menu item deleted");
	},
	onError: (error) => {
		toast.error("Failed to delete menu item", { description: error?.message ?? "Unknown error" });
	}
});
var createAddOnMutationOptions = mutationOptions({
	mutationFn: async (data) => createAddOn({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({ queryKey: addonKeys.all });
		toast.success("Add-on created", { description: `${variables.name} has been added.` });
	},
	onError: (error) => {
		toast.error("Failed to create add-on", { description: error?.message ?? "Unknown error" });
	}
});
var deleteAddOnMutationOptions = mutationOptions({
	mutationFn: async (data) => deleteAddOn({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, mutationContext) => {
		await mutationContext?.client?.invalidateQueries({ queryKey: addonKeys.all });
		toast.success("Add-on deleted");
	},
	onError: (error) => {
		toast.error("Failed to delete add-on", { description: error?.message ?? "Unknown error" });
	}
});
var updateAddOnMutationOptions = mutationOptions({
	mutationFn: async (data) => updateAddOn({ data }),
	onSuccess: (_data, variables, _onMutateResult, mutationContext) => {
		mutationContext?.client?.invalidateQueries({ queryKey: addonKeys.all });
		toast.success("Add-on updated", { description: `${variables.name} was saved successfully.` });
	},
	onError: (error) => {
		toast.error("Failed to update add-on", { description: error?.message ?? "Unknown error" });
	}
});
function AddOnDeleteDialog({ item, open, isPending, onOpenChange, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogMedia, {
				className: "bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { weight: "fill" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete add-on?" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: item ? `Delete ${item.name}? This removes the add-on from the list, but order history keeps its snapshot data.` : "Delete this add-on? This removes it from the list, but order history keeps its snapshot data." })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
			disabled: isPending,
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			type: "button",
			variant: "destructive",
			onClick: onConfirm,
			disabled: isPending,
			children: isPending ? "Deleting..." : "Delete add-on"
		})] })] })
	});
}
function Dialog$1({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogRoot, {
		"data-slot": "dialog",
		...props
	});
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal$1, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBackdrop, {
		"data-slot": "dialog-overlay",
		className: cn("fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", className),
		...props
	});
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPopup, {
		"data-slot": "dialog-content",
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			"data-slot": "dialog-close",
			render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
				variant: "ghost",
				className: "absolute top-4 right-4",
				size: "icon-sm"
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2", className),
		...props
	});
}
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-slot": "dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, { variant: "outline" }),
			children: "Close"
		})]
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		"data-slot": "dialog-title",
		className: cn("leading-none font-medium", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		"data-slot": "dialog-description",
		className: cn("text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className),
		...props
	});
}
var AddOnFormSchema = object({
	name: string().trim().min(1, "Add-on name is required").max(20, "Add-on name must be 20 characters or fewer"),
	amount: number({ error: "Amount is required" }).min(0, "Amount must be zero or more")
});
function AddOnModal({ open, onClose, onSave, item }) {
	const form = useAppForm({
		defaultValues: {
			name: item?.name ?? "",
			amount: item?.amount ?? 0
		},
		validators: { onChange: AddOnFormSchema },
		onSubmit: async ({ value }) => {
			onSave({
				name: value.name.trim(),
				amount: value.amount
			});
		}
	});
	(0, import_react.useEffect)(() => {
		if (open) form.reset();
	}, [form, open]);
	if (!open) return null;
	const isEditing = Boolean(item);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: true,
		onOpenChange: (nextOpen) => {
			if (!nextOpen) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			showCloseButton: false,
			className: "max-w-md rounded-3xl p-0 sm:max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "mb-6 flex-row items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-lg font-bold text-(--near-black)",
							children: isEditing ? "Edit add-on" : "Add an add-on"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-sm text-(--medium-gray)",
							children: isEditing ? "Update the add-on name and amount." : "Create a new menu add-on with a name and amount."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg p-1.5 transition-colors hover:bg-(--off-white)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, {
							weight: "bold",
							className: "h-5 w-5 text-(--medium-gray)"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						form.handleSubmit();
					},
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
							name: "name",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
								label: "Add-on name *",
								placeholder: "e.g. Extra shot",
								maxLength: 20
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
							name: "amount",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.NumberField, {
								label: "Amount (PHP) *",
								min: "0",
								step: "0.01",
								placeholder: "0.00"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
								type: "button",
								onClick: onClose,
								variant: "outline",
								className: "flex-1",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
								selector: (state) => [state.canSubmit, state.isSubmitting],
								children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
									type: "submit",
									disabled: !canSubmit || isSubmitting,
									className: "flex flex-1 items-center justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
										weight: "bold",
										className: "h-4 w-4"
									}), isEditing ? "Save changes" : "Add add-on"]
								})
							})]
						})
					]
				})]
			})
		})
	});
}
function Card({ className, size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card",
		"data-size": size,
		className: cn("group/card flex flex-col gap-6 overflow-hidden rounded-xl bg-card py-6 text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-header",
		className: cn("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-6 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-content",
		className: cn("px-6 group-data-[size=sm]/card:px-4", className),
		...props
	});
}
function CardFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-footer",
		className: cn("flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4", className),
		...props
	});
}
function AddOnCard({ item, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-(--light-gray) bg-(--pure-white) shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "border-b border-(--light-gray) pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold text-(--near-black)",
					children: item.name
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-(--deep-forest)",
					children: formatPeso(item.amount)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-(--medium-gray)",
					children: "Add-on amount"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
				className: "gap-2 border-t border-(--light-gray) pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onEdit?.(item),
					className: "flex-1 rounded-xl border border-(--light-gray) px-4 py-2 text-sm font-semibold text-(--deep-forest) transition-colors hover:bg-(--off-white)",
					children: "Edit add-on"
				}), onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onDelete(item),
					className: "inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50",
					"aria-label": `Delete ${item.name}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, {
						weight: "bold",
						className: "size-4"
					})
				}) : null]
			})
		]
	});
}
function AddOnSection({ addOns, isLoading, isError, error, onRetry, onAddClick, onEdit, onDelete }) {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const fuseIndex = (0, import_react.useMemo)(() => new Fuse(addOns, {
		keys: ["name"],
		threshold: .3
	}), [addOns]);
	const filteredAddOns = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return addOns;
		return fuseIndex.search(searchQuery).map((result) => result.item);
	}, [
		searchQuery,
		addOns,
		fuseIndex
	]);
	const isSearching = searchQuery.trim().length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8 rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-(--light-gray) px-6 py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, {
							weight: "bold",
							className: "size-5 text-(--deep-forest)"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-(--deep-forest)",
						children: "Add-ons"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-(--medium-gray)",
						children: "Create extras"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$2, {
							weight: "bold",
							className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search add-ons...",
							className: "h-10 w-full rounded-full border-(--light-gray) bg-(--off-white) pl-9 pr-8 text-sm"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSearchQuery(""),
							className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--medium-gray) transition-colors hover:text-(--dark-gray)",
							"aria-label": "Clear search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, {
								weight: "bold",
								className: "size-3"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onAddClick,
					className: "btn-primary flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, {
						weight: "bold",
						className: "h-4 w-4"
					}), " Add add-on"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-6 py-5",
			children: isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-4 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
						weight: "fill",
						className: "size-10 text-(--error)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-(--deep-forest)",
						children: "Failed to load add-ons"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-(--medium-gray)",
						children: error?.message ?? "Something went wrong"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						onClick: onRetry,
						variant: "outline",
						size: "sm",
						children: "Retry"
					})
				]
			}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" })
			}) : filteredAddOns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: filteredAddOns.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddOnCard, {
					item,
					onEdit,
					onDelete
				}, item.id))
			}) : isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$2, {
						weight: "bold",
						className: "size-8 text-(--medium-gray)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-(--deep-forest)",
						children: [
							"No add-ons match \"",
							searchQuery,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-(--medium-gray)",
						children: "Try a different search term."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-(--deep-forest)",
					children: "No add-ons yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-(--medium-gray)",
					children: "Add quick upgrades customers can choose."
				})]
			})
		})]
	});
}
function MenuDeleteDialog({ item, open, isPending, onOpenChange, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogMedia, {
				className: "bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { weight: "fill" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete menu item?" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: item ? `Delete ${item.name}? This removes the menu item from the list, but order history keeps its snapshot data.` : "Delete this menu item? This removes it from the list, but order history keeps its snapshot data." })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
			disabled: isPending,
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			type: "button",
			variant: "destructive",
			onClick: onConfirm,
			disabled: isPending,
			children: isPending ? "Deleting..." : "Delete item"
		})] })] })
	});
}
var MenuFormSchema = object({
	mode: union([literal("create"), literal("edit")]),
	menuId: string().optional(),
	name: string().trim().min(1, "Name is required"),
	trackInventory: boolean(),
	price: number().optional(),
	itemType: _enum(["CUP", "STANDALONE"]).optional(),
	selectedCupIds: array(string()),
	cupPrices: record(string(), number()),
	standaloneMode: _enum(["existing", "new"]).optional(),
	selectedInventoryId: string(),
	newInventoryName: string(),
	standalonePrice: number().optional()
}).superRefine((d, ctx) => {
	if (!d.trackInventory) {
		if (d.price == null || d.price <= 0) ctx.addIssue({
			code: "custom",
			message: "Price is required",
			path: ["price"]
		});
		return;
	}
	if (!d.itemType) {
		ctx.addIssue({
			code: "custom",
			message: "Item type is required",
			path: ["itemType"]
		});
		return;
	}
	if (d.itemType === "CUP") {
		if (d.selectedCupIds.length === 0) ctx.addIssue({
			code: "custom",
			message: "Select at least one cup size",
			path: ["selectedCupIds"]
		});
		else if (d.selectedCupIds.filter((id) => (d.cupPrices[id] ?? 0) <= 0).length > 0) ctx.addIssue({
			code: "custom",
			message: "All selected cups need a price",
			path: ["cupPrices"]
		});
		return;
	}
	if (d.itemType === "STANDALONE") {
		if (!d.standaloneMode) {
			ctx.addIssue({
				code: "custom",
				message: "Select a standalone mode",
				path: ["standaloneMode"]
			});
			return;
		}
		if (d.standaloneMode === "existing") {
			if (d.selectedInventoryId.length === 0) ctx.addIssue({
				code: "custom",
				message: "Select an inventory item",
				path: ["selectedInventoryId"]
			});
		}
		if (d.standaloneMode === "new") {
			if (d.newInventoryName.trim().length === 0) ctx.addIssue({
				code: "custom",
				message: "Inventory name is required",
				path: ["newInventoryName"]
			});
		}
		if (d.standalonePrice == null || d.standalonePrice <= 0) ctx.addIssue({
			code: "custom",
			message: "Price is required",
			path: ["standalonePrice"]
		});
	}
});
function getDefaultValues(editingItem) {
	if (editingItem) {
		const isTracked = editingItem.type !== null;
		const isCupTracked = editingItem.type === "CUP";
		const isStandaloneTracked = editingItem.type === "STANDALONE";
		const selectedCupIds = isCupTracked ? editingItem.menuInventories.map((entry) => entry.inventoryId) : [];
		const cupPrices = isCupTracked ? Object.fromEntries(editingItem.menuInventories.map((entry) => [entry.inventoryId, entry.price])) : {};
		const primaryLink = editingItem.menuInventories[0];
		return {
			mode: "edit",
			menuId: editingItem.id,
			name: editingItem.name,
			trackInventory: isTracked,
			price: editingItem.price ?? void 0,
			itemType: editingItem.type ?? void 0,
			selectedCupIds,
			cupPrices,
			standaloneMode: isStandaloneTracked ? "existing" : void 0,
			selectedInventoryId: isStandaloneTracked && primaryLink ? primaryLink.inventoryId : "",
			newInventoryName: "",
			standalonePrice: isStandaloneTracked && primaryLink ? primaryLink.price : void 0
		};
	}
	return {
		mode: "create",
		name: "",
		trackInventory: false,
		price: void 0,
		itemType: void 0,
		selectedCupIds: [],
		cupPrices: {},
		standaloneMode: void 0,
		selectedInventoryId: "",
		newInventoryName: "",
		standalonePrice: void 0
	};
}
function useMenuForm({ editingItem, onClose }) {
	const saveMenuMutation = useMutation(saveMenuMutationOptions);
	return {
		form: useAppForm({
			defaultValues: getDefaultValues(editingItem),
			validationLogic: revalidateLogic({ mode: "submit" }),
			validators: { onDynamic: MenuFormSchema },
			onSubmit: async ({ value }) => {
				await saveMenuMutation.mutateAsync(value);
				onClose();
			}
		}),
		isEditing: Boolean(editingItem),
		isPending: saveMenuMutation.isPending
	};
}
function MenuCupSection({ cupItems, selectedCupIds, cupPrices, onToggleCup, onChangePrice }) {
	if (cupItems.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-4 text-center text-sm text-(--medium-gray)",
		children: "No cup sizes in inventory. Add cups first."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "block text-xs font-medium text-(--medium-gray)",
				children: "Cup Sizes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: cupItems.map((cup) => {
					const isSelected = selectedCupIds.includes(cup.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						className: cn("flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 transition-all", isSelected ? "border-(--deep-forest) bg-(--pale-yellow) shadow-sm" : "border-(--light-gray) bg-(--pure-white)"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
								checked: isSelected,
								onCheckedChange: () => onToggleCup(cup.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-(--dark-gray)",
									children: cup.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-(--medium-gray)",
									children: "Track this cup size"
								})]
							})]
						}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
							weight: "bold",
							className: "h-3 w-3 text-(--deep-forest)"
						}) : null]
					}, cup.id);
				})
			}),
			selectedCupIds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "block text-xs font-medium text-(--medium-gray)",
					children: "Prices (₱)"
				}), selectedCupIds.map((cupId) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							className: "w-28 shrink-0 text-xs font-medium text-(--dark-gray)",
							children: [cupItems.find((item) => item.id === cupId)?.name ?? cupId, ":"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
							type: "number",
							value: cupPrices[cupId],
							onChange: (e) => onChangePrice(cupId, e.target.valueAsNumber),
							className: "h-10 flex-1 text-sm"
						})]
					}, cupId);
				})]
			}) : null
		]
	});
}
function MenuStandaloneSection({ form, standaloneItems }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "mb-2 block text-xs font-medium text-(--medium-gray)",
				children: "Inventory Source"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
				name: "standaloneMode",
				children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Radio, {
					label: "",
					options: [{
						value: "existing",
						label: "Existing item",
						description: "Link to an already tracked inventory item."
					}, {
						value: "new",
						label: "Auto-create",
						description: "Create a new inventory item for this menu item."
					}]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
				selector: (state) => state.values.standaloneMode,
				children: (standaloneMode) => standaloneMode === "existing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
					selector: (state) => state.values.selectedInventoryId,
					children: (selectedInventoryId) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block text-xs font-medium text-(--medium-gray)",
						children: "Select Inventory Item"
					}), standaloneItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: standaloneItems.map((item) => {
							const isSelected = selectedInventoryId === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
								type: "button",
								variant: isSelected ? "default" : "outline",
								className: cn("flex h-auto w-full items-center justify-between rounded-xl px-4 py-3 text-left", isSelected ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--dark-gray)"),
								onClick: () => form.setFieldValue("selectedInventoryId", item.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", isSelected ? "bg-white/15 text-white" : "bg-(--off-white) text-(--medium-gray)"),
										children: [item.stock, " stock"]
									}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-5 items-center justify-center rounded-full bg-white/15",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
											weight: "bold",
											className: "size-3 text-white"
										})
									}) : null]
								})]
							}, item.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-4 text-center text-sm text-(--medium-gray)",
						children: "No standalone items in inventory."
					})] })
				}) : standaloneMode === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
						selector: (state) => state.values.newInventoryName,
						children: (newInventoryName) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "mb-1.5 block text-xs font-medium text-(--medium-gray)",
									children: "New Inventory Item Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									type: "text",
									value: newInventoryName,
									onChange: (e) => form.setFieldValue("newInventoryName", e.target.value),
									placeholder: "e.g. Coke, Sprite"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									size: "sm",
									onClick: () => form.setFieldValue("newInventoryName", form.state.values.name),
									children: "Use Same Name"
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
				selector: (state) => state.values.standaloneMode,
				children: (standaloneMode) => standaloneMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
					selector: (state) => state.values.standalonePrice,
					children: (standalonePrice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block text-xs font-medium text-(--medium-gray)",
						children: "Price (₱) *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
						type: "number",
						min: 1,
						step: 1,
						value: standalonePrice ?? "",
						onChange: (e) => form.setFieldValue("standalonePrice", e.target.value === "" ? void 0 : e.target.valueAsNumber),
						placeholder: "0",
						onWheel: (e) => e.currentTarget.blur()
					})] })
				})
			})
		]
	});
}
function MenuModal({ inventoryItems, modal, onClose }) {
	const { form, isEditing } = useMenuForm({
		editingItem: modal.kind === "edit" ? modal.item : null,
		onClose
	});
	if (modal.kind === "closed") return null;
	const cupItems = inventoryItems.filter((item) => item.type === "CUP");
	const standaloneItems = inventoryItems.filter((item) => item.type === "STANDALONE");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
		open: true,
		onOpenChange: (open) => {
			if (!open) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
			className: "flex-row items-start justify-between gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-lg font-bold text-(--near-black)",
					children: isEditing ? "Edit menu item" : "Add menu item"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-sm text-(--medium-gray)",
					children: "Configure how this menu item is priced and tracked."
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				form.handleSubmit();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-y-auto space-y-5 max-h-120 px-2 pb-2 overflow-x-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "name",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
							label: "Name",
							placeholder: "e.g. Spanish Latte"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
						name: "trackInventory",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Switch, {
							label: "Track Inventory Item",
							description: "Link this menu item to inventory for stock tracking"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
						selector: (s) => s.values.trackInventory,
						children: (trackInventory) => trackInventory ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "itemType",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Radio, {
									label: "Item Type",
									description: "Choose how this menu item tracks inventory",
									options: [{
										value: "CUP",
										label: "Cup",
										description: "Track cup sizes and set a price for each one."
									}, {
										value: "STANDALONE",
										label: "Standalone",
										description: "Link to an existing inventory item or create one."
									}]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
								selector: (s) => s.values.itemType,
								children: (itemType) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuTrackedBody, {
									form,
									itemType,
									cupItems,
									standaloneItems
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
							name: "price",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: field.name,
									className: "text-sm font-medium text-(--dark-gray)",
									children: "Price (₱) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									id: field.name,
									type: "number",
									min: 1,
									step: 1,
									placeholder: "0",
									value: field.state.value ?? "",
									onChange: (e) => field.handleChange(e.target.valueAsNumber),
									onBlur: field.handleBlur
								})]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
				className: "pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
					type: "button",
					onClick: onClose,
					variant: "outline",
					className: "flex-1",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
					selector: (state) => [state.canSubmit, state.isSubmitting],
					children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
						type: "submit",
						disabled: !canSubmit || isSubmitting,
						className: "flex flex-1 items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
							weight: "bold",
							className: "h-4 w-4"
						}), isEditing ? "Save changes" : "Add item"]
					})
				})]
			})]
		})] })
	});
}
function MenuTrackedBody({ form, itemType, cupItems, standaloneItems }) {
	(0, import_react.useEffect)(() => {
		if (itemType === "CUP") {
			form.setFieldValue("standaloneMode", void 0);
			form.setFieldValue("selectedInventoryId", "");
			form.setFieldValue("newInventoryName", "");
			form.setFieldValue("standalonePrice", void 0);
		} else if (itemType === "STANDALONE") {
			form.setFieldValue("selectedCupIds", []);
			form.setFieldValue("cupPrices", {});
		}
	}, [itemType, form]);
	if (itemType === "CUP") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
		selector: (state) => state.values.selectedCupIds,
		children: (selectedCupIds) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
			selector: (state) => state.values.cupPrices,
			children: (cupPrices) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuCupSection, {
				cupItems,
				selectedCupIds,
				cupPrices,
				onToggleCup: (cupId) => {
					if (selectedCupIds.includes(cupId)) {
						form.setFieldValue("selectedCupIds", selectedCupIds.filter((id) => id !== cupId));
						const next = { ...cupPrices };
						delete next[cupId];
						form.setFieldValue("cupPrices", next);
						return;
					}
					form.setFieldValue("selectedCupIds", [...selectedCupIds, cupId]);
					form.setFieldValue("cupPrices", {
						...cupPrices,
						[cupId]: 0
					});
				},
				onChangePrice: (cupId, price) => form.setFieldValue("cupPrices", {
					...cupPrices,
					[cupId]: price
				})
			})
		})
	});
	if (itemType === "STANDALONE") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuStandaloneSection, {
		form,
		standaloneItems
	});
	return null;
}
function MenuCard({ item, onEdit, onDelete }) {
	const trackedItems = item.menuInventories;
	const getBasePrice = () => {
		const lowestPrice = trackedItems.reduce((min, entry) => Math.min(min, entry.price), Infinity);
		if (lowestPrice === Infinity) return `₱${item.price?.toFixed(2)}`;
		return `₱${lowestPrice.toFixed(2)}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "min-h-55 border-(--light-gray) bg-(--pure-white) shadow-sm transition-transform hover:-translate-y-0.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row flex items-start justify-between gap-3 border-b border-(--light-gray) pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-(--near-black)",
					children: item.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-semibold text-(--deep-forest)",
					children: getBasePrice() ?? "Base price not set"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$3, {
						weight: "bold",
						className: "size-5 text-(--deep-forest)"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 h-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: item.type ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-(--light-mint) px-3 py-1 text-[11px] font-semibold text-(--deep-forest)",
						children: item.type
					}) : null
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-(--medium-gray)",
						children: "Tracking"
					}), trackedItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: trackedItems.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex flex-col gap-0.5 rounded-md border border-(--light-gray) bg-(--off-white) px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-(--dark-gray)",
								children: entry.inventoryName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-(--medium-gray)",
								children: ["₱", entry.price.toFixed(2)]
							})]
						}, entry.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-(--medium-gray)",
						children: "No inventory tracking"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
				className: "gap-2 border-t border-(--light-gray) pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onEdit?.(item),
					className: "flex-1 rounded-xl border border-(--light-gray) px-4 py-2 text-sm font-semibold text-(--deep-forest) transition-colors hover:bg-(--off-white)",
					children: "Edit item"
				}), onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onDelete(item),
					className: "inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50",
					"aria-label": `Delete ${item.name}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, {
						weight: "bold",
						className: "size-4"
					})
				}) : null]
			})
		]
	});
}
function MenuGrid({ items, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuCard, {
			item,
			onEdit,
			onDelete
		}, item.id))
	});
}
function MenuSection({ items, searchQuery, isSearching, isLoading, isError, error, onRetry, onSearchChange, onClearSearch, onAddClick, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8 rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-(--light-gray) px-6 py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$3, {
							weight: "bold",
							className: "size-5 text-(--deep-forest)"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-(--deep-forest)",
						children: "Menu Items"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-(--medium-gray)",
						children: "Manage your coffee shop menu"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$2, {
							weight: "bold",
							className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => onSearchChange(e.target.value),
							placeholder: "Search menu or inventory...",
							className: "h-10 w-full rounded-full border border-(--light-gray) bg-(--off-white) pl-9 pr-8 text-sm outline-none focus:border-(--deep-forest)"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClearSearch,
							className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--medium-gray) transition-colors hover:text-(--dark-gray)",
							"aria-label": "Clear search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, {
								weight: "bold",
								className: "size-3"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onAddClick,
					className: "btn-primary flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, {
						weight: "bold",
						className: "h-4 w-4"
					}), " Add menu item"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-6 py-5",
			children: isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-4 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
						weight: "fill",
						className: "size-10 text-(--error)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-(--deep-forest)",
						children: "Failed to load menu items"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-(--medium-gray)",
						children: error?.message ?? "Something went wrong"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						onClick: onRetry,
						variant: "outline",
						size: "sm",
						children: "Retry"
					})
				]
			}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" })
			}) : items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuGrid, {
				items,
				onEdit,
				onDelete
			}) : isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$2, {
						weight: "bold",
						className: "size-8 text-(--medium-gray)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-(--deep-forest)",
						children: [
							"No results for \"",
							searchQuery,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-(--medium-gray)",
						children: "Try a different search term."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$3, {
						weight: "bold",
						className: "size-8 text-(--medium-gray)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-(--deep-forest)",
						children: "No menu items yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-(--medium-gray)",
						children: "Add items to build your coffee shop menu."
					})
				]
			})
		})]
	});
}
function MenuManager({ inventoryItems }) {
	const [tab, setTab] = (0, import_react.useState)("menu");
	const [menuModal, setMenuModal] = (0, import_react.useState)({ kind: "closed" });
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [addOnModal, setAddOnModal] = (0, import_react.useState)({ kind: "closed" });
	const [addOnDeleteTarget, setAddOnDeleteTarget] = (0, import_react.useState)(null);
	const deleteMutation = useMutation(deleteMenuMutationOptions);
	const createAddOnMutation = useMutation(createAddOnMutationOptions);
	const deleteAddOnMutation = useMutation(deleteAddOnMutationOptions);
	const updateAddOnMutation = useMutation(updateAddOnMutationOptions);
	const { data: menuItems, isLoading: menuLoading, isError: menuIsError, error: menuError, refetch: menuRefetch } = useQuery(getAllMenuQueryOptions);
	const { data: addOns, isLoading: addOnLoading, isError: addOnIsError, error: addOnError, refetch: addOnRefetch } = useQuery(getAllAddOnsQueryOptions);
	const safeMenuItems = menuItems ?? [];
	const safeAddOns = addOns ?? [];
	const fuseIndex = (0, import_react.useMemo)(() => new Fuse(safeMenuItems, {
		keys: ["name", "menuInventories.inventoryName"],
		threshold: .3
	}), [safeMenuItems]);
	const filteredItems = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return safeMenuItems;
		return fuseIndex.search(searchQuery).map((result) => result.item);
	}, [
		searchQuery,
		safeMenuItems,
		fuseIndex
	]);
	const handleDelete = async () => {
		if (!deleteTarget) return;
		try {
			await deleteMutation.mutateAsync({ id: deleteTarget.id });
			setDeleteTarget(null);
		} catch {}
	};
	const isSearching = searchQuery.trim().length > 0;
	const handleSaveAddOn = async (data) => {
		if (addOnModal.kind === "edit") await updateAddOnMutation.mutateAsync({
			id: addOnModal.item.id,
			name: data.name.trim(),
			amount: data.amount
		});
		else await createAddOnMutation.mutateAsync({
			name: data.name.trim(),
			amount: data.amount
		});
		setAddOnModal({ kind: "closed" });
	};
	const handleDeleteAddOn = async () => {
		if (!addOnDeleteTarget) return;
		try {
			await deleteAddOnMutation.mutateAsync({ id: addOnDeleteTarget.id });
			setAddOnDeleteTarget(null);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex gap-1.5 rounded-full bg-(--light-gray)/30 p-1 w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("menu"),
					className: cn("rounded-full px-5 py-2 text-sm font-medium transition-colors", tab === "menu" ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--medium-gray) hover:bg-(--light-gray)/50"),
					children: "Menu Items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("add-ons"),
					className: cn("rounded-full px-5 py-2 text-sm font-medium transition-colors", tab === "add-ons" ? "bg-(--deep-forest) text-(--pure-white)" : "text-(--medium-gray) hover:bg-(--light-gray)/50"),
					children: "Add-ons"
				})]
			}),
			tab === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuSection, {
				items: filteredItems,
				searchQuery,
				isSearching,
				isLoading: menuLoading,
				isError: menuIsError,
				error: menuError,
				onRetry: () => menuRefetch(),
				onSearchChange: setSearchQuery,
				onClearSearch: () => setSearchQuery(""),
				onAddClick: () => setMenuModal({ kind: "new" }),
				onEdit: (item) => setMenuModal({
					kind: "edit",
					item
				}),
				onDelete: (item) => setDeleteTarget(item)
			}),
			tab === "add-ons" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddOnSection, {
				addOns: safeAddOns,
				isLoading: addOnLoading,
				isError: addOnIsError,
				error: addOnError,
				onRetry: () => addOnRefetch(),
				onAddClick: () => setAddOnModal({ kind: "new" }),
				onEdit: (item) => setAddOnModal({
					kind: "edit",
					item
				}),
				onDelete: (item) => setAddOnDeleteTarget(item)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuModal, {
				inventoryItems,
				modal: menuModal,
				onClose: () => setMenuModal({ kind: "closed" })
			}, menuModal.kind === "edit" ? `edit-${menuModal.item.id}` : menuModal.kind),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddOnModal, {
				open: addOnModal.kind !== "closed",
				item: addOnModal.kind === "edit" ? addOnModal.item : null,
				onClose: () => setAddOnModal({ kind: "closed" }),
				onSave: handleSaveAddOn
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddOnDeleteDialog, {
				item: addOnDeleteTarget,
				open: Boolean(addOnDeleteTarget),
				isPending: deleteAddOnMutation.isPending,
				onOpenChange: (open) => {
					if (!open) setAddOnDeleteTarget(null);
				},
				onConfirm: () => {
					handleDeleteAddOn();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuDeleteDialog, {
				item: deleteTarget,
				open: Boolean(deleteTarget),
				isPending: deleteMutation.isPending,
				onOpenChange: (open) => {
					if (!open) setDeleteTarget(null);
				},
				onConfirm: () => {
					handleDelete();
				}
			})
		]
	});
}
function RouteComponent() {
	const { data: inventoryItems } = useSuspenseQuery(getAllInventoryQueryOptions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuManager, { inventoryItems });
}
//#endregion
export { RouteComponent as component };
