import { queryOptions } from "@tanstack/react-query";
import adminUsersKeys from "./keys";
import getAccounts from "./server/getAccounts";

export const adminAccountsQueryOptions = queryOptions({
	queryKey: adminUsersKeys.accounts(),
	queryFn: getAccounts,
});

export const adminUsersQueryOptions = adminAccountsQueryOptions;
