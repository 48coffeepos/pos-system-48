import { z } from "zod";

export const PosFormSchema = z.object({
	note: z.string(),
	paymentMethod: z.enum(["CASH", "GCASH", "GRAB"]),
	amountPaid: z.string(),
	referenceNumber: z.string(),
});

export type PosFormValues = z.infer<typeof PosFormSchema>;
export type PaymentMethod = PosFormValues["paymentMethod"];
