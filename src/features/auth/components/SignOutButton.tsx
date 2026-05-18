'use client'

import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signOutMutationOptions } from '../mutationOptions'
import authKeys from '../keys'
import { Button } from '@/components/ui/button'

function SignOutButton() {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation(signOutMutationOptions)

  const handleSignOut = async () => {
    await mutation.mutateAsync()
    queryClient.invalidateQueries({ queryKey: authKeys.session() })
    queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    router.invalidate()
    navigate({ to: '/' })
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      disabled={mutation.isPending}
    >
      Sign Out
    </Button>
  )
}

export { SignOutButton }
