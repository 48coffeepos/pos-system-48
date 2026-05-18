import { mutationOptions } from '@tanstack/react-query'
import { authClient } from '@/integrations/better-auth/auth-client'
import type { SignInInput } from './schemas/auth'

export const signInMutationOptions = mutationOptions({
  mutationFn: async (input: SignInInput) => {
    if (input.method === 'email') {
      const { data, error } = await authClient.signIn.email({
        email: input.email,
        password: input.password,
      })
      if (error) throw new Error(error.message || 'Sign in failed')
      return data
    }
    const { data, error } = await authClient.signIn.username({
      username: input.username,
      password: input.password,
    })
    if (error) throw new Error(error.message || 'Sign in failed')
    return data
  },
})

export const signOutMutationOptions = mutationOptions({
  mutationFn: async () => {
    const { data, error } = await authClient.signOut()
    if (error) throw new Error(error.message || 'Sign out failed')
    return data
  },
})
