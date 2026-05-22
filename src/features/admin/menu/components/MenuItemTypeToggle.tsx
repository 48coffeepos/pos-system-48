import { CoffeeIcon, PackageIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

interface MenuItemTypeToggleProps {
  value: "CUP" | "STANDALONE" | undefined;
  onChange: (value: "CUP" | "STANDALONE") => void;
}

function MenuItemTypeToggle({ value, onChange }: MenuItemTypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange("CUP")}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors",
          value === "CUP"
            ? "border-(--deep-forest) bg-(--pale-yellow) text-(--deep-forest) shadow-sm ring-2 ring-(--deep-forest)/15"
            : "border-(--light-gray) bg-(--pure-white) text-(--dark-gray) hover:border-(--soft-peach)",
        )}
      >
        <CoffeeIcon weight="bold" className="h-4 w-4" />
        Cup
      </button>
      <button
        type="button"
        onClick={() => onChange("STANDALONE")}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors",
          value === "STANDALONE"
            ? "border-(--deep-forest) bg-(--pale-yellow) text-(--deep-forest) shadow-sm ring-2 ring-(--deep-forest)/15"
            : "border-(--light-gray) bg-(--pure-white) text-(--dark-gray) hover:border-(--soft-peach)",
        )}
      >
        <PackageIcon weight="bold" className="h-4 w-4" />
        Standalone
      </button>
    </div>
  );
}

export { MenuItemTypeToggle };
