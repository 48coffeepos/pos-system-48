import { o as __toESM } from "../_runtime.mjs";
import { r as ROLES } from "./auth-BTxLf562.mjs";
import { R as object, V as string } from "../_libs/@better-auth/core+[...].mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as adminAuthMiddleware } from "./middlewares-D1Pk677b.mjs";
import { n as CreateAccountSchema, r as UpdateAccountSchema, t as AccountFormSchema } from "./admin-B2cGA_2Z.mjs";
import { t as Button$1 } from "./button-B7PjkOIj.mjs";
import { t as Separator$1 } from "./separator-QPGMZOHI.mjs";
import { t as Input$1 } from "./input-fxahDhdL.mjs";
import { D as n$2, I as o$2, a as m, b as n$1, g as o$1, j as o, l as n, r as n$4, s as o$4, u as r, x as o$3, z as n$3 } from "../_libs/phosphor-icons__react.mjs";
import { _ as useAppForm, a as FieldLabel, c as InputGroupInput, i as FieldGroup, l as InputGroupText, n as Field, o as InputGroup, r as FieldDescription, s as InputGroupAddon } from "./tanstack-form-BSMHRPNr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CPlEDLjn.mjs";
import { a as useQuery, i as useSuspenseQuery, n as useMutation, s as useQueryClient, t as mutationOptions } from "../_libs/tanstack__react-query.mjs";
import { t as sessionQueryOptions } from "./queryOptions-CF7BS3jI.mjs";
import { n as adminUsersKeys, t as adminAccountsQueryOptions } from "./queryOptions-BztjExpa.mjs";
import { a as AlertDialogDescription, c as AlertDialogMedia, i as AlertDialogContent, l as AlertDialogTitle, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog$1 } from "./alert-dialog-BOYnFZY-.mjs";
import { t as DataTable } from "./data-table-BquxqQ2A.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/accounts-CuAMEIFQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createAccount = createServerFn({ method: "POST" }).middleware([adminAuthMiddleware()]).inputValidator(CreateAccountSchema).handler(createSsrRpc("f67c1b7d9ba30cb6ba0d3b0f139f0013bdb8305f8983925b3c02d6642c9fa6e6"));
var removeAccount = createServerFn({ method: "POST" }).middleware([adminAuthMiddleware()]).inputValidator(object({ userId: string().min(1, "User ID is required") })).handler(createSsrRpc("8acd13e7d2d0979e618e1d53425ddd6f28d3952c765299f2dccfc929ff7f905f"));
var updateAccount = createServerFn({ method: "POST" }).middleware([adminAuthMiddleware()]).inputValidator(UpdateAccountSchema).handler(createSsrRpc("69cb9e663962c2faadf2dd6f0f1542031e2d1194fb0d83f2fe6e4da8b7fd3a5b"));
var createAccountMutationOptions = mutationOptions({
	mutationFn: async (data) => createAccount({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
	}
});
var updateAccountMutationOptions = mutationOptions({
	mutationFn: async (data) => updateAccount({ data }),
	onSuccess: async (_data, _variables, _onMutateResult, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
	}
});
var removeAccountMutationOptions = mutationOptions({
	mutationFn: async (userId) => removeAccount({ data: { userId } }),
	onSuccess: async (_data, _variables, _onMutateResult, context) => {
		await context.client.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
	}
});
function AccountDeleteDialog({ account, open, isPending, onOpenChange, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog$1, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogMedia, {
				className: "bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, { weight: "fill" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete account?" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: account ? `Delete ${account.name}'s account? This action cannot be undone.` : "Delete this account? This action cannot be undone." })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
			disabled: isPending,
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			type: "button",
			variant: "destructive",
			onClick: onConfirm,
			disabled: isPending,
			children: isPending ? "Deleting..." : "Delete Account"
		})] })] })
	});
}
function getDefaultValues(editingAccount) {
	if (editingAccount !== null) return {
		mode: "edit",
		userId: editingAccount.id,
		name: editingAccount.name,
		password: ""
	};
	return {
		mode: "create",
		name: "",
		email: "",
		username: "",
		role: ROLES.staff,
		password: ""
	};
}
function useAccountForm({ editingAccount, onCompleted }) {
	const queryClient = useQueryClient();
	const createAccountMutation = useMutation(createAccountMutationOptions);
	const updateAccountMutation = useMutation(updateAccountMutationOptions);
	const form = useAppForm({
		defaultValues: getDefaultValues(editingAccount),
		validators: { onSubmit: AccountFormSchema },
		onSubmit: async ({ value }) => {
			try {
				if (value.mode === "edit") {
					await updateAccountMutation.mutateAsync({
						userId: value.userId,
						name: value.name,
						password: value.password || void 0
					});
					toast.success(`Updated ${value.name}`);
				} else {
					const { mode, ...createInput } = value;
					await createAccountMutation.mutateAsync(createInput);
					toast.success(`Created ${createInput.name}'s account`);
				}
				await queryClient.invalidateQueries({ queryKey: adminUsersKeys.accounts() });
				form.reset();
				onCompleted();
			} catch (error) {
				toast.error(error?.message ?? "Failed to save account");
			}
		}
	});
	return {
		form,
		isEditing: Boolean(editingAccount),
		isPending: createAccountMutation.isPending || updateAccountMutation.isPending
	};
}
function getRoleLabel$1(role) {
	return role === ROLES.admin ? "Administrator" : "Staff";
}
function AccountForm({ editingAccount, onCancel, onCompleted }) {
	const { form, isEditing, isPending } = useAccountForm({
		editingAccount,
		onCompleted
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "flex flex-col gap-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 rounded-2xl border bg-background p-6 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-10 items-center justify-center rounded-xl bg-muted text-primary",
					children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: isEditing ? "Edit Account" : "Create Account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: isEditing ? "Update the account name or set a new password." : "Add a staff or administrator account for the POS."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					form.handleSubmit();
				},
				className: "flex flex-col gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FieldGroup, {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
								name: "name",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
									label: "Full Name",
									placeholder: "e.g. Maria Clara"
								})
							}),
							isEditing ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
									name: "email",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
										label: "Email",
										type: "email",
										placeholder: "maria@coffee48.com"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
									name: "username",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Input, {
										label: "Username",
										placeholder: "mariaclara"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.AppField, {
									name: "role",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(field.Select, {
										label: "Role",
										placeholder: "Select a role",
										description: "Choose the role when creating the account.",
										options: [{
											value: ROLES.staff,
											label: "Staff"
										}, {
											value: ROLES.admin,
											label: "Administrator"
										}]
									})
								})
							] }),
							isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
									htmlFor: "role-display",
									children: "Role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
									id: "role-display",
									value: getRoleLabel$1(editingAccount?.role ?? null),
									readOnly: true,
									disabled: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: "Role changes stay locked on this screen for now." })
							] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "password",
								children: (field) => {
									const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
										"data-invalid": isInvalid,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
												htmlFor: field.name,
												children: isEditing ? "New Password" : "Password"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InputGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupAddon, {
												align: "inline-start",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupText, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$2, {}) })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputGroupInput, {
												id: field.name,
												type: "password",
												value: field.state.value,
												onChange: (event) => field.handleChange(event.target.value),
												onBlur: field.handleBlur,
												placeholder: "••••••••",
												"aria-invalid": isInvalid
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDescription, { children: isEditing ? "Leave this blank to keep the current password." : "Use at least 8 characters." })
										]
									});
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
						selector: (state) => [state.canSubmit, state.isSubmitting],
						children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
								type: "submit",
								disabled: !canSubmit || isSubmitting || isPending,
								children: [isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$3, { "data-icon": "inline-start" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, { "data-icon": "inline-start" }), isSubmitting || isPending ? isEditing ? "Saving..." : "Creating..." : isEditing ? "Save Changes" : "Create Account"]
							}), isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
								type: "button",
								variant: "outline",
								onClick: onCancel,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$4, { "data-icon": "inline-start" }), "Cancel"]
							}) : null]
						})
					})
				]
			})]
		})
	});
}
function formatLastSeen(lastSeenAt) {
	if (!lastSeenAt) return "No active sessions yet";
	return `Last seen ${new Intl.DateTimeFormat("en-PH", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(new Date(lastSeenAt))}`;
}
function getRoleLabel(role) {
	return role === ROLES.admin ? "Administrator" : "Staff";
}
function getAccountsTableColumns({ currentUserId, isRemovingUser, onEdit, onRequestDelete }) {
	return [
		{
			accessorKey: "name",
			header: "User",
			cell: ({ row }) => {
				const account = row.original;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
						children: account.name.charAt(0).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-medium",
								children: account.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: account.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["@", account.username ?? "no-username"]
							})
						]
					})]
				});
			}
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getRoleLabel(row.original.role) })]
			})
		},
		{
			accessorKey: "isOnline",
			header: "Status",
			cell: ({ row }) => {
				const account = row.original;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$2, {
							weight: "fill",
							className: account.isOnline ? "text-emerald-500" : "text-muted-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: account.isOnline ? "Online" : "Offline" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: formatLastSeen(account.lastSeenAt)
					})]
				});
			}
		},
		{
			id: "actions",
			header: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-right",
				children: "Actions"
			}),
			cell: ({ row }) => {
				const account = row.original;
				const isSelf = account.id === currentUserId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						type: "button",
						variant: "ghost",
						size: "icon-sm",
						onClick: () => onEdit(account),
						"aria-label": `Edit ${account.name}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$3, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						type: "button",
						variant: "destructive",
						size: "icon-sm",
						onClick: () => onRequestDelete(account),
						disabled: isSelf || isRemovingUser,
						"aria-label": `Delete ${account.name}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r, {})
					})]
				});
			}
		}
	];
}
function AccountsTable({ accounts, currentUserId, isRemovingUser, onEdit, onRequestDelete }) {
	const columns = getAccountsTableColumns({
		currentUserId,
		isRemovingUser,
		onEdit,
		onRequestDelete
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "lg:col-span-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 rounded-2xl border bg-background p-6 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Accounts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Manage staff and administrator access."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm font-medium text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$4, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [accounts.length, " total"] })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns,
				data: accounts
			})]
		})
	});
}
function AccountsManager({ users }) {
	const { data: session } = useQuery(sessionQueryOptions);
	const currentUserId = session?.user?.id;
	const [editingAccount, setEditingAccount] = (0, import_react.useState)(null);
	const [accountPendingDelete, setAccountPendingDelete] = (0, import_react.useState)(null);
	const removeMutation = useMutation(removeAccountMutationOptions);
	const handleDelete = async () => {
		if (!accountPendingDelete) return;
		try {
			await removeMutation.mutateAsync(accountPendingDelete.id);
			toast.success(`Deleted ${accountPendingDelete.name}'s account`);
			if (editingAccount?.id === accountPendingDelete.id) setEditingAccount(null);
			setAccountPendingDelete(null);
		} catch (error) {
			toast.error(error?.message ?? "Failed to delete account");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountsTable, {
			accounts: users,
			currentUserId,
			isRemovingUser: removeMutation.isPending,
			onEdit: setEditingAccount,
			onRequestDelete: setAccountPendingDelete
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountForm, {
			editingAccount,
			onCancel: () => setEditingAccount(null),
			onCompleted: () => setEditingAccount(null)
		}, editingAccount?.id ?? "create-account")]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountDeleteDialog, {
		account: accountPendingDelete,
		open: Boolean(accountPendingDelete),
		isPending: removeMutation.isPending,
		onOpenChange: (open) => {
			if (!open) setAccountPendingDelete(null);
		},
		onConfirm: () => {
			handleDelete();
		}
	})] });
}
function AdminUsersPage() {
	const { data } = useSuspenseQuery(adminAccountsQueryOptions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountsManager, { users: data })
	});
}
//#endregion
export { AdminUsersPage as component };
