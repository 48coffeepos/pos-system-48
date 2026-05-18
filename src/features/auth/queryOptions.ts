import { queryOptions } from "@tanstack/react-query";
import authKeys from "./keys";
import { getSession } from "./server/getSession";
import { getUser } from "./server/getUser";

export const sessionQueryOptions = queryOptions({
	queryKey: authKeys.session(),
	queryFn: getSession,
});

export const currentUserQueryOptions = queryOptions({
	queryKey: authKeys.currentUser(),
	queryFn: getUser,
});
