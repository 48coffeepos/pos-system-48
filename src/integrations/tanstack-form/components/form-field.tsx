import type { ReactNode } from 'react'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field'
import { useFieldContext } from '../index'

interface FormFieldProps {
  label: string
  description?: string
  children: ReactNode
}

function FormField({ label, description, children }: FormFieldProps) {
  const field = useFieldContext()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export { FormField }
export type { FormFieldProps }
