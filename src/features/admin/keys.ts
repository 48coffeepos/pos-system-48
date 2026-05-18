const adminUsersKeys = {
	all: ["admin", "users"] as const,
	accounts: () => [...adminUsersKeys.all, "accounts"] as const,
};

export default adminUsersKeys;
