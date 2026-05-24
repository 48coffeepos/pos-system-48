const orderKeys = {
  all: ["orders"] as const,
  today: () => [...orderKeys.all, "today"] as const,
  filtered: (timeframe: string) => [...orderKeys.all, "filtered", timeframe] as const,
};

export default orderKeys;
