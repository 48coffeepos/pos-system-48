import { mutationOptions } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import authKeys from "./keys";
import signOut from "./server/signOut";

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
