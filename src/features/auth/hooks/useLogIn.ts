import { useMutation } from "@tanstack/react-query";
import { useAppForm } from "@/integrations/tanstack-form";
import { logInMutationOptions } from "../mutationOptions";
import { LogInFormSchema, type LogInInput } from "../schemas/auth";

export const useLogIn = () => {
	const mutation = useMutation(logInMutationOptions());

	const form = useAppForm({
		defaultValues: {
			identifier: "",
			password: "",
		},
		validators: {
			onSubmit: LogInFormSchema,
		},
		onSubmit: async ({ value }) => {
			const input: LogInInput = value.identifier.includes("@")
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
