import type { MenuListItem } from "../types";
import { MenuCard } from "./MenuCard";

interface MenuGridProps {
  items: MenuListItem[];
  onEdit?: (item: MenuListItem) => void;
  onDelete?: (item: MenuListItem) => void;
}

function MenuGrid({ items, onEdit, onDelete }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export { MenuGrid };
