import { createServerFn } from "@tanstack/react-start";
import { adminAuthMiddleware } from "@/features/auth/middlewares";
import { z } from "zod";
import { prisma } from "@/integrations/prisma/db";
export const removeAccount = createServerFn({
	method: "POST",
})
	.middleware([adminAuthMiddleware()])
	.inputValidator(z.object({ userId: z.string().min(1, "User ID is required") }))
	.handler(async ({ data }) => {
		try {
			await prisma.user.delete({
				where: { id: data.userId },
			});
			return { success: true };
		} catch (error: any) {
			const isForeignKeyError = error.code === "P2003" || (error.message && error.message.includes("foreign key constraint"));
			if (isForeignKeyError) {
				// Foreign key constraint failed. Soft delete the user so their sales data remains.
				await prisma.user.update({
					where: { id: data.userId },
					data: {
						email: `deleted_${Date.now()}_${Math.random().toString(36).substring(7)}@deleted.local`,
						username: `deleted_${Date.now()}`,
						banned: true,
					},
				});
				return { success: true };
			}
			console.error("Failed to delete account:", error);
			throw new Error("Failed to delete account: " + (error.message || "Unknown error"));
		}
	});
