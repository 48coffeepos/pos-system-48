import { queryOptions } from "@tanstack/react-query";
import adminUsersKeys from "./keys";
import getUsers from "./server/getUsers";

export const adminUsersQueryOptions = queryOptions({
	queryKey: adminUsersKeys.list(),
	queryFn: getUsers,
});
