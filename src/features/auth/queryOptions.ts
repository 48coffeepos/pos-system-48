import { queryOptions } from "@tanstack/react-query";
import authKeys from "./keys";
import { getSession } from "./server/getSession";

export const sessionQueryOptions = queryOptions({
	queryKey: authKeys.session(),
	queryFn: getSession,
});
