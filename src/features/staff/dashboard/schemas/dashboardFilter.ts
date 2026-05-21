import { z } from "zod";

export const dashboardFilterSchema = z.object({
	period: z.enum(["today", "week"]),
});

export type DashboardFilterValues = z.infer<typeof dashboardFilterSchema>;

export const defaultDashboardFilterValues = (): DashboardFilterValues => ({
	period: "today",
});
