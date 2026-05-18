import { queryOptions } from '@tanstack/react-query'
import { authClient } from '@/integrations/better-auth/auth-client'
import authKeys from './keys'

export const sessionQueryOptions = queryOptions({
  queryKey: authKeys.session(),
  queryFn: async () => {
    const { data, error } = await authClient.getSession()
    if (error) return null
    return data
  },
  staleTime: 1000 * 60 * 5,
})

export const currentUserQueryOptions = queryOptions({
  queryKey: authKeys.currentUser(),
  queryFn: async () => {
    const { data } = await authClient.getSession()
    return data?.user ?? null
  },
  staleTime: 1000 * 60 * 5,
})
