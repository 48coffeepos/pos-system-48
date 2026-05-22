import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useFieldContext } from '../index'
import { FormField } from './form-field'

interface FormPasswordProps {
  label: string
  description?: string
  placeholder?: string
}

function FormPassword({ label, description, placeholder }: FormPasswordProps) {
  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = useState(false)
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormField label={label} description={description}>
      <InputGroup className='border-(--deep-forest)'>
        <InputGroupInput
          id={field.name}
          type={showPassword ? 'text' : 'password'}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          className="pr-16"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            tabIndex={-1}
            variant="ghost"
            onClick={() => setShowPassword((value) => !value)}
            className="h-10 px-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FormField>
  )
}

export { FormPassword }
export type { FormPasswordProps }
