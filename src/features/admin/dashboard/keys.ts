const dashboardKeys = {
  all: ["dashboard"] as const,
  today: () => [...dashboardKeys.all, "today"] as const,
};

export default dashboardKeys;
