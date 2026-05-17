import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { FormInput } from './components/form-input'
import { FormTextarea } from './components/form-textarea'
import { FormSelect } from './components/form-select'
import { FormCheckbox } from './components/form-checkbox'
import { FormSwitch } from './components/form-switch'
import { FormRadio } from './components/form-radio'
import { FormSubmitButton } from './components/form-submit-button'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    Switch: FormSwitch,
    Radio: FormRadio,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
  fieldContext,
  formContext,
})
