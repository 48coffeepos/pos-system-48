import { o as __toESM } from "../_runtime.mjs";
import { C as SelectTrigger$1, D as RadioRoot, E as RadioIndicator, I as require_jsx_runtime, L as require_react, O as CheckboxIndicator, S as SelectValue$1, T as RadioGroup, _ as SelectList, b as SelectPortal, d as SwitchRoot, f as SelectScrollUpArrow, g as SelectItem$1, h as SelectItemIndicator, k as CheckboxRoot, m as SelectItemText, p as SelectScrollDownArrow, u as SwitchThumb, v as SelectPopup, w as SelectRoot, x as SelectIcon, y as SelectPositioner } from "../_libs/@base-ui/react+[...].mjs";
import { n as createFormHookContexts, t as createFormHook } from "../_libs/@tanstack/react-form+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import "./separator-QPGMZOHI.mjs";
import { t as Input$1 } from "./input-fxahDhdL.mjs";
import { A as n$1, B as o, H as e, V as o$1, k as n } from "../_libs/phosphor-icons__react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tanstack-form-BSMHRPNr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkbox$1({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxRoot, {
		"data-slot": "checkbox",
		className: cn("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {})
		})
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
function FieldSet({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("fieldset", {
		"data-slot": "field-set",
		className: cn("flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3", className),
		...props
	});
}
function FieldLegend({ className, variant = "legend", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
		"data-slot": "field-legend",
		"data-variant": variant,
		className: cn("mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base", className),
		...props
	});
}
function FieldGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "field-group",
		className: cn("group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4", className),
		...props
	});
}
var fieldVariants = cva("group/field flex w-full gap-3 data-[invalid=true]:text-destructive", {
	variants: { orientation: {
		vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
		horizontal: "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
		responsive: "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
	} },
	defaultVariants: { orientation: "vertical" }
});
function Field({ className, orientation = "vertical", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"data-slot": "field",
		"data-orientation": orientation,
		className: cn(fieldVariants({ orientation }), className),
		...props
	});
}
function FieldContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "field-content",
		className: cn("group/field-content flex flex-1 flex-col gap-1 leading-snug", className),
		...props
	});
}
function FieldLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		"data-slot": "field-label",
		className: cn("group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-3 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10", "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col", className),
		...props
	});
}
function FieldTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "field-label",
		className: cn("flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50", className),
		...props
	});
}
function FieldDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		"data-slot": "field-description",
		className: cn("text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5", "last:mt-0 nth-last-2:-mt-1", "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary", className),
		...props
	});
}
function FieldError({ className, children, errors, ...props }) {
	const content = (0, import_react.useMemo)(() => {
		if (children) return children;
		if (!errors?.length) return null;
		const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];
		if (uniqueErrors?.length == 1) return uniqueErrors[0]?.message;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "ml-4 flex list-disc flex-col gap-1",
			children: uniqueErrors.map((error, index) => error?.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: error.message }, index))
		});
	}, [children, errors]);
	if (!content) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "alert",
		"data-slot": "field-error",
		className: cn("text-sm font-normal text-destructive", className),
		...props,
		children: content
	});
}
function FormCheckbox({ label, description }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		orientation: "horizontal",
		"data-invalid": isInvalid,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
				id: field.name,
				checked: field.state.value,
				onCheckedChange: field.handleChange,
				"aria-invalid": isInvalid
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
				htmlFor: field.name,
				children: label
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description })] }),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: field.state.meta.errors })
		]
	});
}
function FormField({ label, description, children }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		"data-invalid": isInvalid,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
				htmlFor: field.name,
				children: label
			}),
			children,
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: field.state.meta.errors })
		]
	});
}
function FormInput({ label, description, ...props }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label,
		description,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
			id: field.name,
			value: field.state.value,
			onChange: (e) => field.handleChange(e.target.value),
			onBlur: field.handleBlur,
			"aria-invalid": isInvalid,
			...props
		})
	});
}
function FormNumberField({ label, description, ...props }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label,
		description,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
			id: field.name,
			type: "number",
			value: field.state.value,
			onChange: (e) => field.handleChange(e.target.valueAsNumber),
			onBlur: field.handleBlur,
			"aria-invalid": isInvalid,
			...props
		})
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
function InputGroup({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "input-group",
		role: "group",
		className: cn("group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className),
		...props
	});
}
var inputGroupAddonVariants = cva("flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4", {
	variants: { align: {
		"inline-start": "order-first pl-2 has-[>button]:-ml-1 has-[>kbd]:ml-[-0.15rem]",
		"inline-end": "order-last pr-2 has-[>button]:-mr-1 has-[>kbd]:mr-[-0.15rem]",
		"block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
		"block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon({ className, align = "inline-start", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "group",
		"data-slot": "input-group-addon",
		"data-align": align,
		className: cn(inputGroupAddonVariants({ align }), className),
		onClick: (e) => {
			if (e.target.closest("button")) return;
			e.currentTarget.parentElement?.querySelector("input")?.focus();
		},
		...props
	});
}
var inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
	variants: { size: {
		xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
		sm: "",
		"icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
		type,
		"data-size": size,
		variant,
		className: cn(inputGroupButtonVariants({ size }), className),
		...props
	});
}
function InputGroupText({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
function InputGroupInput({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
		"data-slot": "input-group-control",
		className: cn("flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent", className),
		...props
	});
}
function FormPassword({ label, description, placeholder }) {
	const field = useFieldContext();
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label,
		description,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InputGroup, {
			className: "border-(--deep-forest)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupInput, {
				id: field.name,
				type: showPassword ? "text" : "password",
				value: field.state.value,
				onChange: (e) => field.handleChange(e.target.value),
				onBlur: field.handleBlur,
				placeholder,
				"aria-invalid": isInvalid,
				className: "pr-16"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupAddon, {
				align: "inline-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupButton, {
					type: "button",
					tabIndex: -1,
					variant: "ghost",
					onClick: () => setShowPassword((value) => !value),
					className: "h-10 px-3 text-muted-foreground hover:text-foreground",
					children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, {})
				})
			})]
		})
	});
}
function RadioGroup$1({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
		"data-slot": "radio-group",
		className: cn("grid w-full gap-3", className),
		...props
	});
}
function RadioGroupItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioRoot, {
		"data-slot": "radio-group-item",
		className: cn("group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioIndicator, {
			"data-slot": "radio-group-indicator",
			className: "flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" })
		})
	});
}
function FormRadio({ label, description, options }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldSet, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLegend, {
			variant: "label",
			children: label
		}),
		description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
			value: field.state.value,
			onValueChange: field.handleChange,
			children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
				htmlFor: `${field.name}-${opt.value}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					orientation: "horizontal",
					"data-invalid": isInvalid,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldTitle, { children: opt.label }), opt.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: opt.description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
						value: opt.value,
						id: `${field.name}-${opt.value}`,
						"aria-invalid": isInvalid
					})]
				})
			}, opt.value))
		}),
		isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: field.state.meta.errors })
	] });
}
var Select$1 = SelectRoot;
function SelectValue({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue$1, {
		"data-slot": "select-value",
		className: cn("flex flex-1 text-left", className),
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, { render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "pointer-events-none size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "center", alignOffset = 0, alignItemWithTrigger = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPositioner, {
		side,
		sideOffset,
		align,
		alignOffset,
		alignItemWithTrigger,
		className: "isolate z-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectPopup, {
			"data-slot": "select-content",
			"data-align-trigger": alignItemWithTrigger,
			className: cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectList, { children }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
			]
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		"data-slot": "select-item",
		className: cn("relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, {
			className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, {
			render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, { className: "pointer-events-none" })
		})]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpArrow, {
		"data-slot": "select-scroll-up-button",
		className: cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, {})
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownArrow, {
		"data-slot": "select-scroll-down-button",
		className: cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {})
	});
}
function FormSelect({ label, description, placeholder, options }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label,
		description,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select$1, {
			value: field.state.value,
			onValueChange: (v) => field.handleChange(v ?? ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				id: field.name,
				"aria-invalid": isInvalid,
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: placeholder ?? "Select..." })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: opt.value,
				children: opt.label
			}, opt.value)) })]
		})
	});
}
function FormSubmitButton({ label = "Submit", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(useFormContext().Subscribe, {
		selector: (state) => [state.canSubmit, state.isSubmitting],
		children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
			type: "submit",
			disabled: !canSubmit,
			className,
			children: isSubmitting ? `${label}...` : label
		})
	});
}
function Switch$1({ className, size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchRoot, {
		"data-slot": "switch",
		"data-size": size,
		className: cn("peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-primary/20 dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, {
			"data-slot": "switch-thumb",
			className: "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
		})
	});
}
function FormSwitch({ label, description }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
		orientation: "horizontal",
		"data-invalid": isInvalid,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
				htmlFor: field.name,
				children: label
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: description })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
				id: field.name,
				checked: field.state.value,
				onCheckedChange: field.handleChange,
				"aria-invalid": isInvalid
			}),
			isInvalid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { errors: field.state.meta.errors })
		]
	});
}
function FormTextarea({ label, description, ...props }) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label,
		description,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			id: field.name,
			value: field.state.value,
			onChange: (e) => field.handleChange(e.target.value),
			onBlur: field.handleBlur,
			"aria-invalid": isInvalid,
			...props
		})
	});
}
var { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();
var { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		Input: FormInput,
		NumberField: FormNumberField,
		Password: FormPassword,
		Textarea: FormTextarea,
		Select: FormSelect,
		Checkbox: FormCheckbox,
		Switch: FormSwitch,
		Radio: FormRadio
	},
	formComponents: { SubmitButton: FormSubmitButton },
	fieldContext,
	formContext
});
//#endregion
export { useAppForm as _, FieldLabel as a, InputGroupInput as c, Select$1 as d, SelectContent as f, Switch$1 as g, SelectValue as h, FieldGroup as i, InputGroupText as l, SelectTrigger as m, Field as n, InputGroup as o, SelectItem as p, FieldDescription as r, InputGroupAddon as s, Checkbox$1 as t, Label as u };
