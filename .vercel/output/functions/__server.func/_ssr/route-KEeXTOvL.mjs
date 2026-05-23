import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { d as Link, f as useNavigate, i as useLocation, s as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { t as Separator$1 } from "./separator-QPGMZOHI.mjs";
import { E as t, S as e, c as r$1, d as r, m as t$1, n as e$1, s as o } from "../_libs/phosphor-icons__react.mjs";
import { i as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as sessionQueryOptions } from "./queryOptions-CF7BS3jI.mjs";
import { t as authClient } from "./auth-client-7rZ5yLYJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-KEeXTOvL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navLinks = [
	{
		label: "Dashboard",
		path: "/admin",
		icon: r
	},
	{
		label: "Menu",
		path: "/admin/menu",
		icon: t
	},
	{
		label: "Inventory",
		path: "/admin/inventory",
		icon: e
	},
	{
		label: "Accounts",
		path: "/admin/accounts",
		icon: o
	}
];
var adminTo = (path) => path;
function AdminHeader() {
	const location = useLocation();
	const navigate = useNavigate();
	const { data } = useSuspenseQuery(sessionQueryOptions);
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/" });
	};
	(0, import_react.useEffect)(() => {
		if (location.pathname) setMobileMenuOpen(false);
	}, [location.pathname]);
	const isActive = (path) => {
		if (path === "/admin") return location.pathname === "/admin";
		return location.pathname.startsWith(path);
	};
	const currentRole = data?.user.role ?? "Admin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 w-full border-b border-(--light-gray) bg-(--pure-white)/95 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: adminTo("/admin"),
					className: "flex shrink-0 items-center gap-2 no-underline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-16 items-center justify-center overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.png",
							alt: "48 Coffee Co. Logo",
							className: "size-16 object-contain"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, {
					orientation: "vertical",
					className: "hidden h-16 bg-(--light-gray) sm:block"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 lg:flex",
					children: navLinks.map((link) => {
						const Icon = link.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: adminTo(link.path),
							className: cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline", isActive(link.path) ? "bg-(--light-mint) text-(--deep-forest)" : "text-(--medium-gray) hover:bg-(--pale-yellow) hover:text-(--deep-forest)"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), link.label]
						}, link.path);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden flex-1 lg:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-3 lg:flex",
					children: data?.user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-full bg-(--deep-forest)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, {
									weight: "fill",
									className: "size-6 text-(--pale-yellow)"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-(--deep-forest)",
									children: data.user.name ?? "User"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-(--medium-gray)",
									children: currentRole
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, {
							orientation: "vertical",
							className: "h-8 bg-(--light-gray)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "ghost",
							size: "icon",
							onClick: handleLogout,
							className: "text-(--medium-gray) hover:text-(--coral) hover:bg-(--soft-peach)/30",
							title: "Log out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t$1, { className: "size-4" })
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-8 w-8 animate-pulse rounded-full bg-(--light-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-3 w-20 animate-pulse rounded bg-(--light-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-2.5 w-12 animate-pulse rounded bg-(--light-gray)" })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMobileMenuOpen(!mobileMenuOpen),
					className: "ml-auto flex size-9 items-center justify-center rounded-xl text-(--medium-gray) hover:bg-(--pale-yellow) hover:text-(--deep-forest) lg:hidden",
					"aria-label": mobileMenuOpen ? "Close menu" : "Open menu",
					children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$1, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t, { className: "size-5" })
				})
			]
		}), mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-(--light-gray) bg-(--pure-white) px-4 pb-4 pt-2 lg:hidden animate-fade-in-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-col gap-1",
					children: navLinks.map((link) => {
						const Icon = link.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: adminTo(link.path),
							className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline", isActive(link.path) ? "bg-(--light-mint) text-(--deep-forest)" : "text-(--medium-gray) hover:bg-(--pale-yellow) hover:text-(--deep-forest)"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), link.label]
						}, link.path);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, { className: "my-3 bg-(--light-gray)" }),
				data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-9 items-center justify-center rounded-full bg-(--deep-forest)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, {
								weight: "fill",
								className: "size-6 text-(--pale-yellow)"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-(--deep-forest)",
								children: data?.user.name ?? "User"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-(--medium-gray)",
								children: currentRole
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleLogout,
						className: "flex size-9 items-center justify-center rounded-xl text-(--medium-gray) hover:bg-(--soft-peach)/30 hover:text-(--coral)",
						"aria-label": "Log out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t$1, { className: "size-5" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-9 animate-pulse rounded-full bg-(--light-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-3 w-24 animate-pulse rounded bg-(--light-gray)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-2.5 w-16 animate-pulse rounded bg-(--light-gray)" })]
					})]
				})
			]
		})]
	});
}
function AdminLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
