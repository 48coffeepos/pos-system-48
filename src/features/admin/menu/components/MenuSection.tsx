import { CoffeeIcon, MagnifyingGlassIcon, PlusIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import type { MenuListItem } from "../types";
import { MenuGrid } from "./MenuGrid";

interface MenuSectionProps {
  items: MenuListItem[];
  searchQuery: string;
  isSearching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onAddClick: () => void;
  onEdit: (item: MenuListItem) => void;
  onDelete: (item: MenuListItem) => void;
}

function MenuSection({
  items,
  searchQuery,
  isSearching,
  isLoading,
  isError,
  error,
  onRetry,
  onSearchChange,
  onClearSearch,
  onAddClick,
  onEdit,
  onDelete,
}: MenuSectionProps) {
  return (
    <section className="mb-8 rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--light-gray) px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)">
            <CoffeeIcon
              weight="bold"
              className="size-5 text-(--deep-forest)"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-(--deep-forest)">Menu Items</h2>
            <p className="text-sm text-(--medium-gray)">
              Manage your coffee shop menu
            </p>
          </div>
        </div>

        <div className="relative w-full sm:flex-1">
          <MagnifyingGlassIcon
            weight="bold"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search menu or inventory..."
            className="h-10 w-full rounded-full border border-(--light-gray) bg-(--off-white) pl-9 pr-8 text-sm outline-none focus:border-(--deep-forest)"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-(--medium-gray) transition-colors hover:text-(--dark-gray)"
              aria-label="Clear search"
            >
              <XIcon weight="bold" className="size-3" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="btn-primary flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs"
        >
          <PlusIcon weight="bold" className="h-4 w-4" /> Add menu item
        </button>
      </div>

      <div className="px-6 py-5">
        {isError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <WarningCircleIcon weight="fill" className="size-10 text-(--error)" />
            <div>
              <p className="text-sm font-semibold text-(--deep-forest)">Failed to load menu items</p>
              <p className="mt-1 text-xs text-(--medium-gray)">
                {error?.message ?? "Something went wrong"}
              </p>
            </div>
            <Button onClick={onRetry} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-(--deep-forest) border-t-transparent" />
          </div>
        ) : items.length > 0 ? (
          <MenuGrid items={items} onEdit={onEdit} onDelete={onDelete} />
        ) : isSearching ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center">
            <MagnifyingGlassIcon weight="bold" className="size-8 text-(--medium-gray)" />
            <p className="text-sm font-semibold text-(--deep-forest)">
              No results for "{searchQuery}"
            </p>
            <p className="text-xs text-(--medium-gray)">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center">
            <CoffeeIcon weight="bold" className="size-8 text-(--medium-gray)" />
            <p className="text-sm font-semibold text-(--deep-forest)">
              No menu items yet
            </p>
            <p className="text-xs text-(--medium-gray)">
              Add items to build your coffee shop menu.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export { MenuSection };
