import { useMutation } from "@tanstack/react-query";
import { useAppForm } from "@/integrations/tanstack-form";
import { signInMutationOptions } from "../mutationOptions";
import { type SignInInput, signInFormSchema } from "../schemas/auth";

export const useSignIn = () => {
	const mutation = useMutation(signInMutationOptions());

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
