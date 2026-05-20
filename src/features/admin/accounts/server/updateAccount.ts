import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { auth } from "@/integrations/better-auth/auth";
import { UpdateAccountSchema } from "../schemas/admin";

export const updateAccount = createServerFn({
	method: "POST",
})
	.middleware([adminAuthMiddleware()])
	.inputValidator(UpdateAccountSchema)
	.handler(async ({ data }) => {
		const headers = getRequestHeaders();

		const updatedUser = await auth.api.adminUpdateUser({
			body: {
				userId: data.userId,
				data: {
					name: data.name,
				},
			},
			headers,
		});

		if (data.password) {
			await auth.api.setUserPassword({
				body: {
					userId: data.userId,
					newPassword: data.password,
				},
				headers,
			});
		}

		return updatedUser;
	});
