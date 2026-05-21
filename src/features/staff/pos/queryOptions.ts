import { queryOptions } from "@tanstack/react-query";
import posKeys from "./keys";
import { getPosPageData } from "./server/getPosPageData";

export const posPageDataQueryOptions = queryOptions({
	queryKey: posKeys.pageData(),
	queryFn: () => getPosPageData(),
});
