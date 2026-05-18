const adminUsersKeys = {
	all: ["admin", "users"] as const,
	accounts: () => [...adminUsersKeys.all, "accounts"] as const,
	account: (userId: string) => [...adminUsersKeys.accounts(), userId] as const,
};

export default adminUsersKeys;
