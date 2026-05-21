import { z } from "zod";

export const staffSearchSchema = z.object({
	query: z.string(),
});

export type StaffSearchValues = z.infer<typeof staffSearchSchema>;

export const emptyStaffSearchValues = (): StaffSearchValues => ({
	query: "",
});
