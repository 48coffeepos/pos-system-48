import {
	CoffeeIcon,
	ListIcon,
	MagnifyingGlassIcon,
	PackageIcon,
	SignOutIcon,
	SquaresFourIcon,
	UserCircleIcon,
	UsersIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { authClient } from "@/integrations/better-auth/auth-client";
import { cn } from "@/lib/utils";

interface SearchItem {
	label: string;
	path: string;
	category?: string;
	keywords?: string[];
}

interface AdminHeaderProps {
	searchItems?: SearchItem[];
	searchPlaceholder?: string;
}

const defaultSearchItems: SearchItem[] = [
	{ label: "Dashboard", path: "/admin", category: "Page" },
	{ label: "Menu", path: "/admin/menu", category: "Page" },
	{ label: "Inventory", path: "/admin/inventory", category: "Page" },
	{ label: "Accounts", path: "/admin/accounts", category: "Page" },
];

const navLinks = [
	{ label: "Dashboard", path: "/admin", icon: SquaresFourIcon },
	{ label: "Menu", path: "/admin/menu", icon: ListIcon },
	{ label: "Inventory", path: "/admin/inventory", icon: PackageIcon },
	{ label: "Accounts", path: "/admin/accounts", icon: UsersIcon },
];

const adminTo = (path: string) => path as never;

function AdminHeader({
	searchItems = defaultSearchItems,
	searchPlaceholder = "Search pages, items, users...",
}: AdminHeaderProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { data } = useSuspenseQuery(sessionQueryOptions);
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
		navigate({ to: adminTo(path) });
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
		if (location.pathname) setMobileMenuOpen(false);
	}, [location.pathname]);

	const isActive = (path: string) => {
		if (path === "/admin") return location.pathname === "/admin";
		return location.pathname.startsWith(path);
	};

	const currentRole = data?.user.role ?? "Admin";

	return (
		<header className="sticky top-0 z-50 w-full border-b border-(--light-gray) bg-(--pure-white)/95 backdrop-blur-sm">
			<div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					to={adminTo("/admin")}
					className="flex shrink-0 items-center gap-2 no-underline"
				>
					<div className="flex size-9 items-center justify-center rounded-xl bg-(--deep-forest)">
						<CoffeeIcon weight="fill" className="size-5 text-(--pale-yellow)" />
					</div>
					<span className="hidden text-lg font-bold tracking-tight text-(--deep-forest) sm:inline">
						48° Coffee
					</span>
				</Link>

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
								type="button"
								onClick={() => {
									setSearchQuery("");
									setShowResults(false);
									inputRef.current?.focus();
								}}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-(--medium-gray) hover:text-(--deep-forest)"
							>
								<XIcon className="size-4" />
							</button>
						)}
					</div>

					{showResults && searchQuery.trim() && (
						<div className="absolute top-full mt-1.5 w-full rounded-xl border border-(--light-gray) bg-(--pure-white) p-1.5 shadow-lg animate-fade-in-up">
							{results.length > 0 ? (
								<ul className="space-y-0.5">
									{results.map((item) => (
										<li key={`${item.path}-${item.label}`}>
											<button
												type="button"
												onClick={() => handleSearchSelect(item.path)}
												className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-(--pale-yellow)"
											>
												<span className="flex size-6 items-center justify-center rounded-md bg-(--off-white) text-xs font-medium text-(--medium-gray)">
													{item.category?.[0] ?? "P"}
												</span>
												<div className="flex-1">
													<span className="font-medium text-(--deep-forest)">
														{item.label}
													</span>
													{item.category && (
														<span className="ml-2 text-xs text-(--medium-gray)">
															{item.category}
														</span>
													)}
												</div>
											</button>
										</li>
									))}
								</ul>
							) : (
								<p className="px-3 py-4 text-center text-sm text-(--medium-gray)">
									No results found for "{searchQuery}"
								</p>
							)}
						</div>
					)}
				</div>

				<nav className="hidden items-center gap-1 lg:flex">
					{navLinks.map((link) => {
						const Icon = link.icon;
						return (
							<Link
								key={link.path}
								to={adminTo(link.path)}
								className={cn(
									"flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors no-underline",
									isActive(link.path)
										? "bg-(--light-mint) text-(--deep-forest)"
										: "text-(--medium-gray) hover:bg-(--pale-yellow) hover:text-(--deep-forest)",
								)}
							>
								<Icon className="size-4" />
								{link.label}
							</Link>
						);
					})}
				</nav>

				<div className="hidden flex-1 lg:block" />

				<div className="hidden items-center gap-3 lg:flex">
					{data?.user ? (
						<>
							<div className="flex items-center gap-2.5">
								<div className="flex size-8 items-center justify-center rounded-full bg-(--deep-forest)">
									<UserCircleIcon
										weight="fill"
										className="size-6 text-(--pale-yellow)"
									/>
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-sm font-semibold text-(--deep-forest)">
										{data.user.name ?? "User"}
									</span>
									<span className="text-xs text-(--medium-gray)">
										{currentRole}
									</span>
								</div>
							</div>
							<Separator
								orientation="vertical"
								className="h-8 bg-(--light-gray)"
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleLogout}
								className="text-(--medium-gray) hover:text-(--coral) hover:bg-(--soft-peach)/30"
								title="Log out"
							>
								<SignOutIcon className="size-4" />
							</Button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<span className="h-8 w-8 animate-pulse rounded-full bg-(--light-gray)" />
							<div className="space-y-1">
								<span className="block h-3 w-20 animate-pulse rounded bg-(--light-gray)" />
								<span className="block h-2.5 w-12 animate-pulse rounded bg-(--light-gray)" />
							</div>
						</div>
					)}
				</div>

				<button
					type="button"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="ml-auto flex size-9 items-center justify-center rounded-xl text-(--medium-gray) hover:bg-(--pale-yellow) hover:text-(--deep-forest) lg:hidden"
					aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
				>
					{mobileMenuOpen ? (
						<XIcon className="size-5" />
					) : (
						<ListIcon className="size-5" />
					)}
				</button>
			</div>

			{mobileMenuOpen && (
				<div className="border-t border-(--light-gray) bg-(--pure-white) px-4 pb-4 pt-2 lg:hidden animate-fade-in-up">
					<div className="relative mb-3">
						<MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)" />
						<Input
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setShowResults(true);
							}}
							onFocus={() => setShowResults(true)}
							placeholder={searchPlaceholder}
							className="h-9 w-full rounded-xl border-(--light-gray) pl-9 text-sm text-(--deep-forest) placeholder:text-(--medium-gray)"
							style={{ backgroundColor: "var(--warm-beige)" }}
						/>
					</div>

					{showResults && searchQuery.trim() && results.length > 0 && (
						<div className="mb-3 rounded-xl border border-(--light-gray) bg-(--off-white)/50 p-1">
							{results.map((item) => (
								<button
									key={`${item.path}-${item.label}`}
									type="button"
									onClick={() => handleSearchSelect(item.path)}
									className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-(--pale-yellow)"
								>
									<span className="text-(--deep-forest)">{item.label}</span>
									{item.category && (
										<span className="text-xs text-(--medium-gray)">
											{item.category}
										</span>
									)}
								</button>
							))}
						</div>
					)}

					<nav className="flex flex-col gap-1">
						{navLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.path}
									to={adminTo(link.path)}
									className={cn(
										"flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline",
										isActive(link.path)
											? "bg-(--light-mint) text-(--deep-forest)"
											: "text-(--medium-gray) hover:bg-(--pale-yellow) hover:text-(--deep-forest)",
									)}
								>
									<Icon className="size-4" />
									{link.label}
								</Link>
							);
						})}
					</nav>

					<Separator className="my-3 bg-(--light-gray)" />

					{data ? (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="flex size-9 items-center justify-center rounded-full bg-(--deep-forest)">
									<UserCircleIcon
										weight="fill"
										className="size-6 text-(--pale-yellow)"
									/>
								</div>
								<div className="flex flex-col leading-tight">
									<span className="text-sm font-semibold text-(--deep-forest)">
										{data?.user.name ?? "User"}
									</span>
									<span className="text-xs text-(--medium-gray)">
										{currentRole}
									</span>
								</div>
							</div>
							<button
								type="button"
								onClick={handleLogout}
								className="flex size-9 items-center justify-center rounded-xl text-(--medium-gray) hover:bg-(--soft-peach)/30 hover:text-(--coral)"
								aria-label="Log out"
							>
								<SignOutIcon className="size-5" />
							</button>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<span className="size-9 animate-pulse rounded-full bg-(--light-gray)" />
							<div className="space-y-1">
								<span className="block h-3 w-24 animate-pulse rounded bg-(--light-gray)" />
								<span className="block h-2.5 w-16 animate-pulse rounded bg-(--light-gray)" />
							</div>
						</div>
					)}
				</div>
			)}
		</header>
	);
}

export type { AdminHeaderProps, SearchItem };
export { AdminHeader };
