import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/integrations/better-auth/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ShoppingCart,
  List,
  Package,
  CurrencyDollar,
  ClipboardText,
  SignOut,
  UserCircle,
  X,
  Calculator,
} from "@phosphor-icons/react";

interface StaffHeaderProps {
}

const navLinks = [
  { label: "POS", path: "/staff/pos", icon: ShoppingCart },
  { label: "Inventory", path: "/staff/inventory", icon: Package },
  { label: "Cash Logs", path: "/staff/expenses", icon: CurrencyDollar },
  { label: "Orders", path: "/staff/orders", icon: ClipboardText },
  { label: "X-Reading", path: "/staff/xreading", icon: Calculator },
];

const staffTo = (path: string) => path as never;

function StaffHeader({}: StaffHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: "/" });
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/staff/pos") return location.pathname === "/staff/pos";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--light-gray) bg-(--pure-white)/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={staffTo("/staff/pos")}
          className="flex shrink-0 items-center gap-2.5 no-underline"
        >
          <div className="flex size-16 items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="48 Coffee Co. Logo" className="size-16 object-contain" />
          </div>
        </Link>

        <Separator
          orientation="vertical"
          className="hidden h-16 bg-(--light-gray) sm:block"
        />

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
                  <UserCircle
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
                <SignOut className="size-4" />
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
            <X className="size-5" />
          ) : (
            <List className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--light-gray)] bg-[var(--pure-white)] px-4 pb-4 pt-2 lg:hidden animate-fade-in-up">

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
                  <UserCircle
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
                <SignOut className="size-5" />
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

export { StaffHeader };
export type { StaffHeaderProps };
