const posKeys = {
	all: ["pos"] as const,
	pageData: () => [...posKeys.all, "pageData"] as const,
};

export default posKeys;
