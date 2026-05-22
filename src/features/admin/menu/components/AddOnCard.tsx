import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPeso } from "@/lib/format-currency";
import type { AddOnItem } from "../types";

interface AddOnCardProps {
  item: AddOnItem;
}

function AddOnCard({ item }: AddOnCardProps) {
  return (
    <Card className="border-(--light-gray) bg-(--pure-white) shadow-sm">
      <CardHeader className="border-b border-(--light-gray) pb-3">
        <h3 className="text-sm font-semibold text-(--near-black)">
          {item.name}
        </h3>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-lg font-bold text-(--deep-forest)">
          {formatPeso(item.amount)}
        </p>
        <p className="text-xs text-(--medium-gray)">Add-on amount</p>
      </CardContent>
    </Card>
  );
}

export { AddOnCard };
