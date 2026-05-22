import {
	CalculatorIcon,
	ClipboardTextIcon,
	CurrencyDollarIcon,
	ListIcon,
	MagnifyingGlassIcon,
	PackageIcon,
	ShoppingCartIcon,
	SignOutIcon,
	UserCircleIcon,
	XIcon,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/integrations/better-auth/auth-client";
import { cn } from "@/lib/utils";

interface SearchItem {
	label: string;
	path: string;
	category?: string;
	keywords?: string[];
}

interface StaffHeaderProps {
	searchItems?: SearchItem[];
	searchPlaceholder?: string;
}

const defaultSearchItems: SearchItem[] = [
	{ label: "POS", path: "/staff/pos", category: "Page" },
	{ label: "Inventory", path: "/staff/inventory", category: "Page" },
	{ label: "Expenses", path: "/staff/expenses", category: "Page" },
	{ label: "Orders", path: "/staff/orders", category: "Page" },
	{ label: "X-Reading", path: "/staff/xreading", category: "Page" },
];

const navLinks = [
	{ label: "POS", path: "/staff/pos", icon: ShoppingCart },
	{ label: "Inventory", path: "/staff/inventory", icon: Package },
	{ label: "Expenses", path: "/staff/expenses", icon: CurrencyDollar },
	{ label: "Orders", path: "/staff/orders", icon: ClipboardText },
	{ label: "X-Reading", path: "/staff/xreading", icon: Calculator },
];

const staffTo = (path: string) => path as never;

function StaffHeader({
	searchItems = defaultSearchItems,
	searchPlaceholder = "Search pages, orders...",
}: StaffHeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { data: session, isPending: sessionLoading } = authClient.useSession();

	const [searchQuery, setSearchQuery] = useState("");
	const [showResults, setShowResults] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const fuse = useMemo(
		() =>
			new Fuse(searchItems, {
				keys: [
					{ name: "label", weight: 3 },
					{ name: "category", weight: 1 },
					{ name: "keywords", weight: 2 },
				],
				threshold: 0.4,
				includeScore: true,
			}),
		[searchItems],
	);

	const results = useMemo(() => {
		if (!searchQuery.trim()) return [];
		return fuse
			.search(searchQuery)
			.map((r) => r.item)
			.slice(0, 8);
	}, [searchQuery, fuse]);

	const handleSearchSelect = (path: string) => {
		setSearchQuery("");
		setShowResults(false);
		navigate({ to: staffTo(path) });
	};

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/" });
	};

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setShowResults(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, []);

	const isActive = (path: string) => {
		if (path === "/staff/pos") return location.pathname === "/staff/pos";
		return location.pathname.startsWith(path);
	};

	return (
		<header className="top-0 z-50 w-full border-b border-(--light-gray) bg-(--pure-white)/95 backdrop-blur-sm">
			<div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link
					to={staffTo("/staff/pos")}
					className="flex shrink-0 items-center gap-2.5 no-underline"
				>
					<div className="flex size-16 items-center justify-center overflow-hidden">
						<img
							src="/logo.png"
							alt="48 Coffee Co. Logo"
							className="size-16 object-contain"
						/>
					</div>
				</Link>

				<Separator
					orientation="vertical"
					className="hidden h-16 bg-(--light-gray) sm:block"
				/>

				{/* Search */}
				<div
					ref={searchRef}
					className="relative hidden flex-1 sm:block max-w-md"
				>
					<div className="relative">
						<MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
						<Input
							ref={inputRef}
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setShowResults(true);
							}}
							onFocus={() => setShowResults(true)}
							placeholder={searchPlaceholder}
							className="h-9 w-full rounded-xl border-(--light-gray) pl-9 pr-8 text-sm"
						/>
						{searchQuery && (
							<button
								onClick={() => {
									setSearchQuery("");
									setShowResults(false);
									inputRef.current?.focus();
								}}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--medium-gray)] hover:text-[var(--deep-forest)]"
							>
								<XIcon className="size-4" />
							</button>
						)}
					</div>

					{/* Search Results Dropdown */}
					{showResults && searchQuery.trim() && (
						<div className="absolute top-full mt-1.5 w-full rounded-xl border border-[var(--light-gray)] bg-[var(--pure-white)] p-1.5 shadow-lg animate-fade-in-up">
							{results.length > 0 ? (
								<ul className="space-y-0.5">
									{results.map((item) => (
										<li key={`${item.path}-${item.label}`}>
											<button
												onClick={() => handleSearchSelect(item.path)}
												className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--pale-yellow)]"
											>
												<span className="flex size-6 items-center justify-center rounded-md bg-[var(--off-white)] text-xs font-medium text-[var(--medium-gray)]">
													{item.category?.[0] ?? "P"}
												</span>
												<div className="flex-1">
													<span className="font-medium text-[var(--deep-forest)]">
														{item.label}
													</span>
													{item.category && (
														<span className="ml-2 text-xs text-[var(--medium-gray)]">
															{item.category}
														</span>
													)}
												</div>
											</button>
										</li>
									))}
								</ul>
							) : (
								<p className="px-3 py-4 text-center text-sm text-[var(--medium-gray)]">
									No results found for "{searchQuery}"
								</p>
							)}
						</div>
					)}
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-1 lg:flex">
					{navLinks.map((link) => {
						const Icon = link.icon;
						return (
							<Link
								key={link.path}
								to={staffTo(link.path)}
								className={cn(
									"flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline",
									isActive(link.path)
										? "bg-[var(--light-mint)] text-[var(--deep-forest)]"
										: "text-[var(--medium-gray)] hover:bg-[var(--pale-yellow)] hover:text-[var(--deep-forest)]",
								)}
							>
								<Icon className="size-4" />
								{link.label}
							</Link>
						);
					})}
				</nav>

				<div className="hidden flex-1 lg:block" />

				{/* User Info + Logout (Desktop) */}
				<div className="hidden items-center gap-3 lg:flex">
					{!sessionLoading && session?.user ? (
						<>
							<div className="flex items-center gap-2.5">
								<div className="flex size-8 items-center justify-center rounded-full bg-[var(--deep-forest)]">
									<UserCircleIcon
										weight="fill"
										className="size-6 text-[var(--pale-yellow)]"
									/>
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-sm font-semibold text-[var(--deep-forest)]">
										{session.user.name ?? "User"}
									</span>
									<span className="text-xs text-[var(--medium-gray)]">
										{"role" in session.user
											? (session.user as { role?: string }).role
											: "Staff"}
									</span>
								</div>
							</div>
							<Separator
								orientation="vertical"
								className="h-8 bg-[var(--light-gray)]"
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleLogout}
								className="text-[var(--medium-gray)] hover:text-[var(--coral)] hover:bg-[var(--soft-peach)]/30"
								title="Log out"
							>
								<SignOutIcon className="size-4" />
							</Button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<span className="h-8 w-8 animate-pulse rounded-full bg-[var(--light-gray)]" />
							<div className="space-y-1">
								<span className="block h-3 w-20 animate-pulse rounded bg-[var(--light-gray)]" />
								<span className="block h-2.5 w-12 animate-pulse rounded bg-[var(--light-gray)]" />
							</div>
						</div>
					)}
				</div>

				{/* Mobile Menu Toggle */}
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="ml-auto flex size-9 items-center justify-center rounded-xl text-[var(--medium-gray)] hover:bg-[var(--pale-yellow)] hover:text-[var(--deep-forest)] lg:hidden"
					aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
				>
					{mobileMenuOpen ? (
						<XIcon className="size-5" />
					) : (
						<ListIcon className="size-5" />
					)}
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="border-t border-[var(--light-gray)] bg-[var(--pure-white)] px-4 pb-4 pt-2 lg:hidden animate-fade-in-up">
					{/* Mobile Search */}
					<div className="relative mb-3">
						<MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--medium-gray)]" />
						<Input
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setShowResults(true);
							}}
							onFocus={() => setShowResults(true)}
							placeholder={searchPlaceholder}
							className="h-9 w-full rounded-xl border-[var(--light-gray)] pl-9 text-sm text-[var(--deep-forest)] placeholder:text-[var(--medium-gray)]"
							style={{ backgroundColor: "var(--warm-beige)" }}
						/>
					</div>

					{/* Mobile Results */}
					{showResults && searchQuery.trim() && results.length > 0 && (
						<div className="mb-3 rounded-xl border border-[var(--light-gray)] bg-[var(--off-white)]/50 p-1">
							{results.map((item) => (
								<button
									key={`${item.path}-${item.label}`}
									onClick={() => handleSearchSelect(item.path)}
									className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--pale-yellow)]"
								>
									<span className="text-[var(--deep-forest)]">
										{item.label}
									</span>
									{item.category && (
										<span className="text-xs text-[var(--medium-gray)]">
											{item.category}
										</span>
									)}
								</button>
							))}
						</div>
					)}

					{/* Mobile Nav */}
					<nav className="flex flex-col gap-1">
						{navLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.path}
									to={staffTo(link.path)}
									className={cn(
										"flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline",
										isActive(link.path)
											? "bg-[var(--light-mint)] text-[var(--deep-forest)]"
											: "text-[var(--medium-gray)] hover:bg-[var(--pale-yellow)] hover:text-[var(--deep-forest)]",
									)}
								>
									<Icon className="size-4" />
									{link.label}
								</Link>
							);
						})}
					</nav>

					<Separator className="my-3 bg-[var(--light-gray)]" />

					{/* Mobile User Info */}
					{!sessionLoading && session?.user ? (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="flex size-9 items-center justify-center rounded-full bg-[var(--deep-forest)]">
									<UserCircleIcon
										weight="fill"
										className="size-6 text-[var(--pale-yellow)]"
									/>
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-sm font-semibold text-[var(--deep-forest)]">
										{session.user.name ?? "User"}
									</span>
									<span className="text-xs text-[var(--medium-gray)]">
										{"role" in session.user
											? (session.user as { role?: string }).role
											: "Staff"}
									</span>
								</div>
							</div>
							<button
								onClick={handleLogout}
								className="flex size-9 items-center justify-center rounded-xl text-[var(--medium-gray)] hover:bg-[var(--soft-peach)]/30 hover:text-[var(--coral)]"
								aria-label="Log out"
							>
								<SignOutIcon className="size-5" />
							</button>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<span className="size-9 animate-pulse rounded-full bg-[var(--light-gray)]" />
							<div className="space-y-1">
								<span className="block h-3 w-24 animate-pulse rounded bg-[var(--light-gray)]" />
								<span className="block h-2.5 w-16 animate-pulse rounded bg-[var(--light-gray)]" />
							</div>
						</div>
					)}
				</div>
			)}
		</header>
	);
}

export type { SearchItem, StaffHeaderProps };
export { StaffHeader };
