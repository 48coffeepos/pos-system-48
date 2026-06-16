const CUP_PATTERN = /^(\d+oz)\s+(hot|iced)$|^(hot|iced)\s+(\d+oz)$/i;

export function parseCupInfo(name: string): {
  cup_type: string;
  cup_size: string;
} {
  const match = name.match(CUP_PATTERN);
  if (match) {
    return {
      cup_type: (match[2] || match[3]).toUpperCase(),
      cup_size: (match[1] || match[4]).toUpperCase(),
    };
  }
  return { cup_type: name, cup_size: "CUSTOM" };
}

export function parseCupInfoKey(name: string): string {
  const { cup_type, cup_size } = parseCupInfo(name);
  return `${cup_size} ${cup_type}`;
}

const CUP_SORT_PRIORITY: Record<string, number> = {
  "16OZ ICED": 0,
  "12OZ ICED": 1,
  "12OZ HOT": 2,
};

export function getCupSortPriority(name: string): number {
  const key = parseCupInfoKey(name);
  return CUP_SORT_PRIORITY[key] ?? 100;
}

export function sortCupInventoryItems<
  T extends { inventory: { name: string } },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const priorityDiff =
      getCupSortPriority(a.inventory.name) - getCupSortPriority(b.inventory.name);
    if (priorityDiff !== 0) return priorityDiff;
    return a.inventory.name.localeCompare(b.inventory.name);
  });
}
