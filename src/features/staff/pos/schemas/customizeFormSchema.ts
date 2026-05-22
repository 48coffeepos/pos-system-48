import { z } from "zod";

export const CustomizeFormSchema = z
	.object({
		discountType: z.enum(["NONE", "SENIOR", "PWD"]),
		discountName: z.string(),
		discountId: z.string(),
		isFreeDrink: z.boolean(),
		quantity: z.number().min(1),
	})
	.superRefine((data, ctx) => {
		if (data.discountType === "NONE") return;

		if (!data.discountName.trim()) {
			ctx.addIssue({
				code: "custom",
				message: "Name is required",
				path: ["discountName"],
			});
		}
		if (!data.discountId.trim()) {
			ctx.addIssue({
				code: "custom",
				message: "ID is required",
				path: ["discountId"],
			});
		}
	});

export type CustomizeFormValues = z.infer<typeof CustomizeFormSchema>;
