import { useMutation } from "@tanstack/react-query";
import { signOutMutationOptions } from "../mutationOptions";

export const useSignOut = () => {
	const mutation = useMutation(signOutMutationOptions());

	const handleSignOut = async () => {
		mutation.mutateAsync({});
	};

	return { handleSignOut, isPending: mutation.isPending };
};
