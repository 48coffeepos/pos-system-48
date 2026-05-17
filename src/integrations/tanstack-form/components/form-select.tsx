'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFieldContext } from '../index'
import { FormField } from './form-field'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  description?: string
  placeholder?: string
  options: SelectOption[]
}

function FormSelect({ label, description, placeholder, options }: FormSelectProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormField label={label} description={description}>
      <Select
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v ?? '')}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className="w-full"
        >
          <SelectValue placeholder={placeholder ?? 'Select...'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

export { FormSelect }
export type { FormSelectProps, SelectOption }
