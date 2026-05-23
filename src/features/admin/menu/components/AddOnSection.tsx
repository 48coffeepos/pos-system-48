import { MagnifyingGlassIcon, PlusIcon, SparkleIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { AddOnItem } from "../types";
import { AddOnCard } from "./AddOnCard";

interface AddOnSectionProps {
  addOns: AddOnItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  onAddClick: () => void;
  onEdit?: (item: AddOnItem) => void;
  onDelete?: (item: AddOnItem) => void;
}

function AddOnSection({ addOns, isLoading, isError, error, onRetry, onAddClick, onEdit, onDelete }: AddOnSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const fuseIndex = useMemo(
    () =>
      new Fuse(addOns, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [addOns],
  );

  const filteredAddOns = useMemo(() => {
    if (!searchQuery.trim()) return addOns;
    return fuseIndex.search(searchQuery).map((result) => result.item);
  }, [searchQuery, addOns, fuseIndex]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <section className="mb-8 rounded-2xl border border-(--light-gray) bg-(--pure-white) shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--light-gray) px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-(--pale-yellow)">
            <SparkleIcon
              weight="bold"
              className="size-5 text-(--deep-forest)"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-(--deep-forest)">Add-ons</h2>
            <p className="text-sm text-(--medium-gray)">
              Create extras
            </p>
          </div>
        </div>

        <div className="relative w-full sm:flex-1">
          <MagnifyingGlassIcon
            weight="bold"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--medium-gray)"
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search add-ons..."
            className="h-10 w-full rounded-full border-(--light-gray) bg-(--off-white) pl-9 pr-8 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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
          <PlusIcon weight="bold" className="h-4 w-4" /> Add add-on
        </button>
      </div>

      <div className="px-6 py-5">
        {isError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <WarningCircleIcon weight="fill" className="size-10 text-(--error)" />
            <div>
              <p className="text-sm font-semibold text-(--deep-forest)">Failed to load add-ons</p>
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
        ) : filteredAddOns.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredAddOns.map((item) => (
              <AddOnCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        ) : isSearching ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center">
            <MagnifyingGlassIcon weight="bold" className="size-8 text-(--medium-gray)" />
            <p className="text-sm font-semibold text-(--deep-forest)">
              No add-ons match "{searchQuery}"
            </p>
            <p className="text-xs text-(--medium-gray)">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--light-gray) px-6 py-8 text-center">
            <p className="text-sm font-semibold text-(--deep-forest)">
              No add-ons yet
            </p>
            <p className="text-xs text-(--medium-gray)">
              Add quick upgrades customers can choose.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export { AddOnSection };
