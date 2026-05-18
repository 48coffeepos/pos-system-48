const adminUsersKeys = {
  all: ['admin', 'users'] as const,
  list: () => [...adminUsersKeys.all, 'list'] as const,
}

export default adminUsersKeys
