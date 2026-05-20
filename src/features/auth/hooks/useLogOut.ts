import { useMutation } from "@tanstack/react-query";
import { logOutMutationOptions } from "../mutationOptions";

export const useLogOut = () => {
	const mutation = useMutation(logOutMutationOptions());

	const handleLogOut = async () => {
		mutation.mutateAsync({});
	};

	return { handleLogOut, isPending: mutation.isPending };
};
