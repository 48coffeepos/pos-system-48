import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAppForm } from "@/integrations/tanstack-form";
import { authClient } from "@/integrations/better-auth/auth-client";
import authKeys from "../keys";
import { type SignInInput, signInFormSchema } from "../schemas/auth";

export const useSignIn = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: SignInInput) => {
			if (input.method === "email") {
				const { data, error } = await authClient.signIn.email({
					email: input.email,
					password: input.password,
				});
				if (error) throw new Error(error.message || "Sign in failed");
				return data?.user;
			}
			const { data, error } = await authClient.signIn.username({
				username: input.username,
				password: input.password,
			});
			if (error) throw new Error(error.message || "Sign in failed");
			return data?.user;
		},
		onSuccess: (user) => {
			if (user) {
				toast.success(
					`Signed in successfully: ${user.username} ${"role" in user && `(${user.role})`}`,
				);
			}
			queryClient.invalidateQueries({ queryKey: authKeys.all });
			router.invalidate();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const form = useAppForm({
		defaultValues: {
			identifier: "",
			password: "",
		},
		validators: {
			onSubmit: signInFormSchema,
		},
		onSubmit: async ({ value }) => {
			const input: SignInInput = value.identifier.includes("@")
				? {
						method: "email" as const,
						email: value.identifier,
						password: value.password,
					}
				: {
						method: "username" as const,
						username: value.identifier,
						password: value.password,
					};

			await mutation.mutateAsync(input);
		},
	});
	return form;
};
