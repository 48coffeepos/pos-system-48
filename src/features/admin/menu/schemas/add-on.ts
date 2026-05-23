import { z } from "zod";

export const AddOnFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add-on name is required")
    .max(20, "Add-on name must be 20 characters or fewer"),
  amount: z.number({ error: "Amount is required" }).min(0, "Amount must be zero or more"),
});

export type AddOnFormInput = z.output<typeof AddOnFormSchema>;
