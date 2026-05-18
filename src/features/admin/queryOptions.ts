import { queryOptions } from "@tanstack/react-query";
import adminUsersKeys from "./keys";
import getAccounts from "./server/getAccounts";

export const adminUsersQueryOptions = queryOptions({
	queryKey: adminUsersKeys.accounts(),
	queryFn: getAccounts,
});
