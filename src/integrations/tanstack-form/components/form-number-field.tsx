'use client'

import { Input } from '@/components/ui/input'
import { useFieldContext } from '../index'
import { FormField } from './form-field'

interface FormNumberFieldProps {
  label: string
  description?: string
  placeholder?: string
  step?: string
  min?: string
  max?: string
}

function FormNumberField({ label, description, ...props }: FormNumberFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormField label={label} description={description}>
      <Input
        id={field.name}
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      />
    </FormField>
  )
}

export { FormNumberField }
export type { FormNumberFieldProps }
