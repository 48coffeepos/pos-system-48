import { mutationOptions } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import authKeys from "./keys";
import type { SignInInput } from "./schemas/auth";
import signIn from "./server/signIn";
import signOut from "./server/signOut";

export const signInMutationOptions = () => {
	const router = useRouter();
	return mutationOptions({
		mutationFn: async (input: SignInInput) => {
			return await signIn({ data: input });
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

export const signOutMutationOptions = () => {
	const router = useRouter();
	return mutationOptions({
		mutationFn: signOut,
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
