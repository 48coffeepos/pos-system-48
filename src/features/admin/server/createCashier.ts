import { createServerFn } from "@tanstack/react-start";
import { ROLES } from "@/features/auth/schemas/auth";
import { auth } from "@/integrations/better-auth/auth";
import { CreateCashierSchema } from "../schemas/admin";

export const createCashier = createServerFn({
	method: "POST",
})
	.inputValidator(CreateCashierSchema)
	.handler(async ({ data }) => {
		const cashier = await auth.api.createUser({
			body: { ...data, role: ROLES.enum.cashier },
		});

		return cashier;
	});
