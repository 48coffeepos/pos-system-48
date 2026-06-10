const dashboardKeys = {
  all: ["dashboard"] as const,
  today: () => [...dashboardKeys.all, "today"] as const,
  reconciliation: (date: "today" | "yesterday") =>
    [...dashboardKeys.all, "reconciliation", date] as const,
  cupSales: (date: "today" | "yesterday") =>
    [...dashboardKeys.all, "cupSales", date] as const,
};

export default dashboardKeys;
