const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
}

export default authKeys
