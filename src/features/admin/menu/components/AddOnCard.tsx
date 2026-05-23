import { TrashIcon } from "@phosphor-icons/react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatPeso } from "@/lib/format-currency";
import type { AddOnItem } from "../types";

interface AddOnCardProps {
  item: AddOnItem;
  onEdit?: (item: AddOnItem) => void;
  onDelete?: (item: AddOnItem) => void;
}

function AddOnCard({ item, onEdit, onDelete }: AddOnCardProps) {
  return (
    <Card className="border-(--light-gray) bg-(--pure-white) shadow-sm">
      <CardHeader className="border-b border-(--light-gray) pb-3">
        <h3 className="text-lg font-semibold text-(--near-black)">
          {item.name}
        </h3>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm font-bold text-(--deep-forest)">
          {formatPeso(item.amount)}
        </p>
        <p className="text-xs text-(--medium-gray)">Add-on amount</p>
      </CardContent>
      <CardFooter className="gap-2 border-t border-(--light-gray) pt-4">
        <button
          type="button"
          onClick={() => onEdit?.(item)}
          className="flex-1 rounded-xl border border-(--light-gray) px-4 py-2 text-sm font-semibold text-(--deep-forest) transition-colors hover:bg-(--off-white)"
        >
          Edit add-on
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            aria-label={`Delete ${item.name}`}
          >
            <TrashIcon weight="bold" className="size-4" />
          </button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { AddOnCard };
