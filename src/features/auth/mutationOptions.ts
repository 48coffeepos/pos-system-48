import { mutationOptions } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import authKeys from "./keys";
import type { LogInInput } from "./schemas/auth";
import logIn from "./server/logIn";
import logOut from "./server/logOut";

export const logInMutationOptions = () => {
	const router = useRouter();
	return mutationOptions({
		mutationFn: async (input: LogInInput) => {
			return await logIn({ data: input });
		},
		onSuccess: (user, __, ___, context) => {
			toast.success(
				`Signed in successfully: ${user.username} ${"role" in user && `(${user.role})`}`,
			);
			context.client.invalidateQueries({ queryKey: authKeys.all });
			router.invalidate();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};

export const logOutMutationOptions = () => {
	const router = useRouter();
	return mutationOptions({
		mutationFn: logOut,
		onSuccess: (_, __, ___, context) => {
			toast.success("Signed out successfully");
			context.client.invalidateQueries({ queryKey: authKeys.all });
			router.invalidate();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});
};
