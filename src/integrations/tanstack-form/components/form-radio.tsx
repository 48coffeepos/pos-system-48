'use client'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFieldContext } from '../index'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface FormRadioProps {
  label: string
  description?: string
  options: RadioOption[]
}

function FormRadio({ label, description, options }: FormRadioProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet>
      <FieldLegend variant="label">{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <RadioGroup
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        {options.map((opt) => (
          <FieldLabel key={opt.value} htmlFor={`${field.name}-${opt.value}`}>
            <Field orientation="horizontal" data-invalid={isInvalid}>
              <FieldContent>
                <FieldTitle>{opt.label}</FieldTitle>
                {opt.description && (
                  <FieldDescription>{opt.description}</FieldDescription>
                )}
              </FieldContent>
              <RadioGroupItem
                value={opt.value}
                id={`${field.name}-${opt.value}`}
                aria-invalid={isInvalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}

export { FormRadio }
export type { FormRadioProps, RadioOption }
