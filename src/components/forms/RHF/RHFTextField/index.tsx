import { ComponentProps, HTMLInputTypeAttribute, ReactElement } from 'react'
import { Control, Controller, useController } from 'react-hook-form'
import TextField from '@material-ui/core/TextField/TextField'

type Props = {
  name: string
  control: Control<any, unknown>
  rules?: ComponentProps<typeof Controller>['rules']
  label: string
  type?: HTMLInputTypeAttribute
}

const RHFTextField = ({ name, rules, control, ...props }: Props): ReactElement => {
  const {
    field: { ref, ...field },
    fieldState,
  } = useController({
    name,
    rules,
    control,
  })

  return (
    <TextField
      innerRef={ref}
      {...field}
      {...props}
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
      InputLabelProps={{ shrink: props.type === 'date' || !!field.value }}
    />
  )
}

export default RHFTextField
