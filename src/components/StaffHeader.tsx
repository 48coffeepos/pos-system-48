import {
	CoffeeIcon,
	SignOutIcon,
	SquaresFourIcon,
	UserCircleIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sessionQueryOptions } from "@/features/auth/queryOptions";
import { authClient } from "@/integrations/better-auth/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [{ label: "POS", path: "/staff/pos", icon: SquaresFourIcon }];

const staffTo = (path: string) => path as never;

export function StaffHeader() {
	const location = useLocation();
	const navigate = useNavigate();
	const { data } = useSuspenseQuery(sessionQueryOptions);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const currentRole = data?.user.role ?? "Staff";

	const handleLogout = async () => {
		await authClient.signOut();
		navigate({ to: "/" });
	};

	const isActive = (path: string) => location.pathname.startsWith(path);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-(--light-gray) bg-(--pure-white)/95 backdrop-blur-sm">
			<div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					to={staffTo("/staff")}
					className="flex shrink-0 items-center gap-2 no-underline"
				>
					<div className="flex size-9 items-center justify-center rounded-xl bg-(--deep-forest)">
						<CoffeeIcon weight="fill" className="size-5 text-(--pale-yellow)" />
					</div>
					<span className="hidden text-lg font-bold tracking-tight text-(--deep-forest) sm:inline">
						48° Coffee
					</span>
				</Link>

				<nav className="hidden items-center gap-1 lg:flex">
					{navLinks.map((link) => {
						const Icon = link.icon;
						return (
							<Link
								key={link.path}
								to={staffTo(link.path)}
								onClick={() => setMobileMenuOpen(false)}
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
					) : null}
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
						<SquaresFourIcon className="size-5" />
					)}
				</button>
			</div>

			{mobileMenuOpen ? (
				<div className="border-t border-(--light-gray) bg-(--pure-white) px-4 pb-4 pt-2 lg:hidden animate-fade-in-up">
					<nav className="flex flex-col gap-1">
						{navLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.path}
									to={staffTo(link.path)}
									onClick={() => setMobileMenuOpen(false)}
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

					{data?.user ? (
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
										{data.user.name ?? "User"}
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
					) : null}
				</div>
			) : null}
		</header>
	);
}
