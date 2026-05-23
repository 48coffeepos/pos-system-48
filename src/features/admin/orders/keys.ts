const orderKeys = {
  all: ["orders"] as const,
  today: () => [...orderKeys.all, "today"] as const,
};

export default orderKeys;
