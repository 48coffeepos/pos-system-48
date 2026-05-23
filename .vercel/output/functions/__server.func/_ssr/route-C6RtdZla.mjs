import { o as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@base-ui/react+[...].mjs";
import { d as Link, f as useNavigate, i as useLocation, s as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button$1 } from "./button-B7PjkOIj.mjs";
import { t as Separator$1 } from "./separator-QPGMZOHI.mjs";
import { E as t$1, F as e$1, M as o, S as e, U as a, c as r$1, h as r, m as t, n as e$2 } from "../_libs/phosphor-icons__react.mjs";
import { t as authClient } from "./auth-client-7rZ5yLYJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-C6RtdZla.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navLinks = [
	{
		label: "POS",
		path: "/staff/pos",
		icon: r
	},
	{
		label: "Inventory",
		path: "/staff/inventory",
		icon: e
	},
	{
		label: "Cash Logs",
		path: "/staff/expenses",
		icon: o
	},
	{
		label: "Orders",
		path: "/staff/orders",
		icon: e$1
	},
	{
		label: "X-Reading",
		path: "/staff/xreading",
		icon: a
	}
];
var staffTo = (path) => path;
function StaffHeader() {
	const location = useLocation();
	const navigate = useNavigate();
	const { data: session, isPending: sessionLoading } = authClient.useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/" });
	};
	(0, import_react.useEffect)(() => {
		setMobileMenuOpen(false);
	}, []);
	const isActive = (path) => {
		if (path === "/staff") return location.pathname === "/staff";
		return location.pathname.startsWith(path);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "top-0 z-50 w-full border-b border-(--light-gray) bg-(--pure-white)/95 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: staffTo("/staff/pos"),
					className: "flex shrink-0 items-center gap-2.5 no-underline",
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
							to: staffTo(link.path),
							className: cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline", isActive(link.path) ? "bg-[var(--light-mint)] text-[var(--deep-forest)]" : "text-[var(--medium-gray)] hover:bg-[var(--pale-yellow)] hover:text-[var(--deep-forest)]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), link.label]
						}, link.path);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden flex-1 lg:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-3 lg:flex",
					children: !sessionLoading && session?.user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-full bg-[var(--deep-forest)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, {
									weight: "fill",
									className: "size-6 text-[var(--pale-yellow)]"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-[var(--deep-forest)]",
									children: session.user.name ?? "User"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-[var(--medium-gray)]",
									children: "role" in session.user ? session.user.role : "Staff"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, {
							orientation: "vertical",
							className: "h-8 bg-[var(--light-gray)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							variant: "ghost",
							size: "icon",
							onClick: handleLogout,
							className: "text-[var(--medium-gray)] hover:text-[var(--coral)] hover:bg-[var(--soft-peach)]/30",
							title: "Log out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t, { className: "size-4" })
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-8 w-8 animate-pulse rounded-full bg-[var(--light-gray)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-3 w-20 animate-pulse rounded bg-[var(--light-gray)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-2.5 w-12 animate-pulse rounded bg-[var(--light-gray)]" })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMobileMenuOpen(!mobileMenuOpen),
					className: "ml-auto flex size-9 items-center justify-center rounded-xl text-[var(--medium-gray)] hover:bg-[var(--pale-yellow)] hover:text-[var(--deep-forest)] lg:hidden",
					"aria-label": mobileMenuOpen ? "Close menu" : "Open menu",
					children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e$2, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t$1, { className: "size-5" })
				})
			]
		}), mobileMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-[var(--light-gray)] bg-[var(--pure-white)] px-4 pb-4 pt-2 lg:hidden animate-fade-in-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-col gap-1",
					children: navLinks.map((link) => {
						const Icon = link.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: staffTo(link.path),
							className: cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline", isActive(link.path) ? "bg-[var(--light-mint)] text-[var(--deep-forest)]" : "text-[var(--medium-gray)] hover:bg-[var(--pale-yellow)] hover:text-[var(--deep-forest)]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), link.label]
						}, link.path);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, { className: "my-3 bg-[var(--light-gray)]" }),
				!sessionLoading && session?.user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-9 items-center justify-center rounded-full bg-[var(--deep-forest)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r$1, {
								weight: "fill",
								className: "size-6 text-[var(--pale-yellow)]"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-[var(--deep-forest)]",
								children: session.user.name ?? "User"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-[var(--medium-gray)]",
								children: [
									"role" in session.user ? session.user.role : "Staff",
									"a",
									" "
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleLogout,
						className: "flex size-9 items-center justify-center rounded-xl text-[var(--medium-gray)] hover:bg-[var(--soft-peach)]/30 hover:text-[var(--coral)]",
						"aria-label": "Log out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t, { className: "size-5" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-9 animate-pulse rounded-full bg-[var(--light-gray)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-3 w-24 animate-pulse rounded bg-[var(--light-gray)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-2.5 w-16 animate-pulse rounded bg-[var(--light-gray)]" })]
					})]
				})
			]
		})]
	});
}
function StaffLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "h-screen flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	});
}
//#endregion
export { StaffLayout as component };
