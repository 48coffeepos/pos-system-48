import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react, P as require_react_dom } from "../_libs/@base-ui/react+[...].mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { t as Input$1 } from "./input-fxahDhdL.mjs";
import { C as o, H as e$1, T as o$1, i as e$2, y as e } from "../_libs/phosphor-icons__react.mjs";
import { a as useQuery, n as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as getAllInventoryQueryOptions } from "./queryOptions-C0OTdcSZ.mjs";
import { i as updateInventoryItemMutationOptions, n as addStockMutationOptions, r as createInventoryItemMutationOptions, t as InventoryList } from "./InventoryList-DnjBzYzr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-DfJTX1W0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var itemTypeOptions = [{
	value: "STANDALONE",
	label: "Standalone Item (e.g., Sprite, Coke)"
}, {
	value: "CUP",
	label: "Cup (e.g., 12oz (Hot), 16oz (Cold))"
}];
function AddInventoryItem({ items, editingItem, onCancelEdit }) {
	const inventoryItems = items ?? [];
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectionState, setSelectionState] = (0, import_react.useState)("idle");
	const [selectedItem, setSelectedItem] = (0, import_react.useState)(null);
	const [itemName, setItemName] = (0, import_react.useState)("");
	const [itemType, setItemType] = (0, import_react.useState)("STANDALONE");
	const [quantity, setQuantity] = (0, import_react.useState)("");
	const [newItemQuantity, setNewItemQuantity] = (0, import_react.useState)(0);
	const [buttonPosition, setButtonPosition] = (0, import_react.useState)(null);
	const dropdownRef = (0, import_react.useRef)(null);
	const buttonRef = (0, import_react.useRef)(null);
	const searchInputRef = (0, import_react.useRef)(null);
	const createMutation = useMutation({
		...createInventoryItemMutationOptions,
		onSettled: () => {
			handleClear();
		}
	});
	const addStockMutation = useMutation({
		...addStockMutationOptions,
		onSettled: () => {
			handleClear();
		}
	});
	const updateMutation = useMutation({
		...updateInventoryItemMutationOptions,
		onSettled: () => {
			handleClear();
		}
	});
	const isPending = createMutation.isPending || addStockMutation.isPending || updateMutation.isPending;
	const filteredItems = (0, import_react.useMemo)(() => {
		if (!searchQuery.trim()) return inventoryItems;
		const q = searchQuery.toLowerCase();
		return inventoryItems.filter((item) => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));
	}, [searchQuery, inventoryItems]);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(e) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	(0, import_react.useEffect)(() => {
		if (editingItem) {
			setSelectionState("editing");
			setItemName(editingItem.name);
			setItemType(editingItem.type);
			setNewItemQuantity(editingItem.stock);
		}
	}, [editingItem]);
	(0, import_react.useEffect)(() => {
		if (isOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
		else setSearchQuery("");
	}, [isOpen]);
	const handleSelectNew = () => {
		setSelectionState("new");
		setSelectedItem(null);
		setItemName("");
		setItemType("STANDALONE");
		setNewItemQuantity(0);
		setIsOpen(false);
	};
	const handleSelectExisting = (item) => {
		setSelectionState("existing");
		setSelectedItem(item);
		setQuantity("");
		setIsOpen(false);
	};
	const handleClear = () => {
		setSelectionState("idle");
		setSelectedItem(null);
		setItemName("");
		setItemType("STANDALONE");
		setQuantity("");
		setNewItemQuantity(0);
		onCancelEdit?.();
	};
	const getDisplayValue = () => {
		if (selectionState === "new") return "+ Add New Item";
		if (selectedItem) return `${selectedItem.name} (Current: ${selectedItem.stock})`;
		return "";
	};
	const isFormValid = () => {
		if (selectionState === "new") return itemName.trim().length > 0;
		if (selectionState === "existing") return quantity !== "" && Number(quantity) > 0;
		if (selectionState === "editing") return itemName.trim().length > 0;
		return false;
	};
	const handleSubmit = () => {
		if (selectionState === "new") createMutation.mutate({
			name: itemName.trim(),
			stock: newItemQuantity,
			type: itemType
		});
		else if (selectionState === "existing" && selectedItem && quantity !== "") addStockMutation.mutate({
			itemId: selectedItem.id,
			quantity: Number(quantity)
		});
		else if (selectionState === "editing" && editingItem) updateMutation.mutate({
			id: editingItem.id,
			name: itemName.trim(),
			stock: newItemQuantity,
			type: itemType
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm",
		style: { overflow: "clip" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-(--light-gray) px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)",
					children: editingItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
						weight: "bold",
						className: "size-5 text-(--deep-forest)"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
						weight: "bold",
						className: "size-5 text-(--deep-forest)"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-(--deep-forest)",
					children: editingItem ? "Edit Item" : "Add New Item"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-(--medium-gray)",
					children: editingItem ? "Update item details" : "Update stock records"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 px-6 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium text-(--dark-gray)",
							children: editingItem ? "Editing Item" : "Select Item"
						}), editingItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-10 items-center gap-2 rounded-xl border border-(--deep-forest) bg-(--pale-yellow)/30 px-3 text-sm text-(--deep-forest)",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
									weight: "bold",
									className: "size-4 shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: editingItem.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800",
									children: editingItem.type === "CUP" ? "Cup Size" : "Standalone"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							ref: dropdownRef,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								ref: buttonRef,
								type: "button",
								onClick: () => {
									if (!isOpen && buttonRef.current) {
										const rect = buttonRef.current.getBoundingClientRect();
										setButtonPosition({
											top: rect.bottom + window.scrollY,
											left: rect.left + window.scrollX,
											width: rect.width
										});
									}
									setIsOpen(!isOpen);
								},
								className: cn("flex h-10 w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors", "bg-(--pure-white)", selectionState !== "idle" ? "border-(--deep-forest) text-(--deep-forest)" : "border-(--light-gray) text-(--medium-gray)"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn(selectionState !== "idle" ? "text-(--deep-forest)" : "text-(--medium-gray)"),
									children: getDisplayValue() || "Choose an item..."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, {
									weight: "bold",
									className: cn("size-4 text-(--medium-gray) transition-transform duration-200", isOpen && "rotate-180")
								})]
							}), isOpen && buttonPosition && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: dropdownRef,
								className: "animate-fade-in-up fixed z-50 rounded-xl border border-(--light-gray) bg-(--pure-white) p-1.5 shadow-lg",
								style: {
									top: `${buttonPosition.top + 8}px`,
									left: `${buttonPosition.left}px`,
									width: `${buttonPosition.width}px`
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, { className: "pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											ref: searchInputRef,
											value: searchQuery,
											onChange: (e) => setSearchQuery(e.target.value),
											placeholder: "Search items...",
											className: "h-8 w-full rounded-lg border-(--light-gray) pl-8 text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleSelectNew,
										className: cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors", "text-(--deep-forest) hover:bg-(--pale-yellow)", selectionState === "new" && "bg-(--pale-yellow)"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-5 items-center justify-center rounded-md border border-(--light-gray)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
												weight: "bold",
												className: "size-3"
											})
										}), "Add New Item"]
									}),
									filteredItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 border-t border-(--light-gray)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-h-48 overflow-y-auto",
										children: filteredItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-0.5",
											children: filteredItems.map((item) => {
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleSelectExisting(item),
													className: cn("grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors", "text-(--dark-gray) hover:bg-(--pale-yellow)", selectionState === "existing" && selectedItem?.id === item.id && "bg-(--pale-yellow)"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right leading-tight",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] text-(--medium-gray)",
															children: "Current"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-medium text-(--deep-forest)",
															children: item.stock
														})]
													})]
												}, item.id);
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-3 py-4 text-center text-sm text-(--medium-gray)",
											children: "No items found"
										})
									})
								]
							}), document.body)]
						})]
					}),
					selectionState === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade-in-up space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-(--dark-gray)",
										children: "Item Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-(--medium-gray)",
										children: [itemName.length, " / 20"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									value: itemName,
									onChange: (e) => setItemName(e.target.value.slice(0, 20)),
									maxLength: 20,
									placeholder: "e.g. 12oz (Hot), Coke",
									className: "h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-(--dark-gray)",
									children: "Item Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: itemType,
									onChange: (e) => setItemType(e.target.value),
									className: "h-10 w-full rounded-xl border border-(--light-gray) bg-(--pure-white) px-3 text-sm text-(--dark-gray) outline-none transition-[color,box-shadow] focus-visible:border-(--deep-forest) focus-visible:ring-2 focus-visible:ring-(--deep-forest)/20",
									children: itemTypeOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: opt.value,
										children: opt.label
									}, opt.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-(--dark-gray)",
										children: "Quantity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-(--medium-gray)",
										children: [String(newItemQuantity).length, " / 5"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									type: "text",
									inputMode: "numeric",
									value: newItemQuantity,
									onChange: (e) => {
										let val = e.target.value.replace(/[^0-9]/g, "");
										val = val.slice(0, 5);
										setNewItemQuantity(val === "" ? 0 : Number(val));
									},
									placeholder: "0",
									maxLength: 5,
									className: "h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
								})]
							})
						]
					}),
					selectionState === "existing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade-in-up space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-(--dark-gray)",
									children: "Add Quantity"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-(--medium-gray)",
									children: [quantity === "" ? "0" : String(quantity).length, " / 5"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
								type: "text",
								inputMode: "numeric",
								value: quantity,
								onChange: (e) => {
									let val = e.target.value.replace(/[^0-9]/g, "");
									val = val.slice(0, 5);
									setQuantity(val === "" ? "" : Number(val));
								},
								placeholder: "0",
								maxLength: 5,
								className: "h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-(--medium-gray)",
								children: "This will add to the existing quantity"
							})
						]
					}),
					selectionState === "editing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade-in-up space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-(--dark-gray)",
										children: "Item Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-(--medium-gray)",
										children: [itemName.length, " / 20"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									value: itemName,
									onChange: (e) => setItemName(e.target.value.slice(0, 20)),
									maxLength: 20,
									placeholder: "e.g. 12oz (Hot), Coke",
									className: "h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium text-(--dark-gray)",
									children: "Item Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: itemType,
									onChange: (e) => setItemType(e.target.value),
									className: "h-10 w-full rounded-xl border border-(--light-gray) bg-(--pure-white) px-3 text-sm text-(--dark-gray) outline-none transition-[color,box-shadow] focus-visible:border-(--deep-forest) focus-visible:ring-2 focus-visible:ring-(--deep-forest)/20",
									children: itemTypeOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: opt.value,
										children: opt.label
									}, opt.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium text-(--dark-gray)",
										children: "Stock"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-(--medium-gray)",
										children: [String(newItemQuantity).length, " / 5"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									type: "text",
									inputMode: "numeric",
									value: newItemQuantity,
									onChange: (e) => {
										let val = e.target.value.replace(/[^0-9]/g, "");
										val = val.slice(0, 5);
										setNewItemQuantity(val === "" ? 0 : Number(val));
									},
									placeholder: "0",
									maxLength: 5,
									className: "h-10 w-full rounded-xl border-(--light-gray) px-3 text-sm"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-(--light-gray) px-6 py-4",
				children: selectionState === "editing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleClear,
						disabled: isPending,
						className: cn("flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-semibold transition-all", "border border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:bg-(--light-gray)/20 active:scale-[0.98]"),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleSubmit,
						disabled: !isFormValid() || isPending,
						className: cn("flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all", isFormValid() && !isPending ? "bg-(--deep-forest) text-(--pure-white) hover:bg-(--forest-green) active:scale-[0.98]" : "cursor-not-allowed bg-(--light-gray) text-(--medium-gray)"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
							weight: "bold",
							className: "size-4"
						}), isPending ? "Saving..." : "Save Changes"]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleSubmit,
					disabled: !isFormValid() || isPending,
					className: cn("flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all", isFormValid() && !isPending ? "bg-(--deep-forest) text-(--pure-white) hover:bg-(--forest-green) active:scale-[0.98]" : "cursor-not-allowed bg-(--light-gray) text-(--medium-gray)"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
						weight: "bold",
						className: "size-4"
					}), isPending ? `${selectionState === "new" ? "Creating" : "Adding"}...` : selectionState === "new" ? "Create Item" : "Add Quantity"]
				})
			})
		]
	});
}
function AdminInventory() {
	const { data: inventoryItems, isLoading, isError, error, refetch } = useQuery(getAllInventoryQueryOptions);
	const [editingItem, setEditingItem] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[1fr_400px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-(--light-gray) bg-(--pure-white) p-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center gap-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, {
							weight: "fill",
							className: "size-10 text-(--error)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold text-(--deep-forest)",
							children: "Failed to load inventory"
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
			}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryList, {
				items: inventoryItems ?? [],
				onEdit: setEditingItem
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:sticky lg:top-24 lg:self-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddInventoryItem, {
					items: inventoryItems ?? [],
					editingItem,
					onCancelEdit: () => setEditingItem(null)
				})
			})]
		})
	});
}
//#endregion
export { AdminInventory as component };
