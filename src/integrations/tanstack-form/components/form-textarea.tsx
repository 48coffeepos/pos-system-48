'use client'

import { Textarea } from '@/components/ui/textarea'
import { useFieldContext } from '../index'
import { FormField } from './form-field'

interface FormTextareaProps {
  label: string
  description?: string
  placeholder?: string
  rows?: number
}

function FormTextarea({ label, description, ...props }: FormTextareaProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormField label={label} description={description}>
      <Textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      />
    </FormField>
  )
}

export { FormTextarea }
export type { FormTextareaProps }
