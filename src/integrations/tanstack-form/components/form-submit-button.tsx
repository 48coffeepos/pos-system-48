'use client'

import { Button } from '@/components/ui/button'
import { useFormContext } from '../index'

interface FormSubmitButtonProps {
  label?: string
}

function FormSubmitButton({ label = 'Submit' }: FormSubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
    >
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? `${label}...` : label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export { FormSubmitButton }
export type { FormSubmitButtonProps }
