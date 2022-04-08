import { HTMLInputTypeAttribute, ReactElement } from 'react'
import { Control, FieldValues, Path, useController, UseControllerProps } from 'react-hook-form'
import TextField from '@material-ui/core/TextField/TextField'

type Props<T> = {
  name: Path<T>
  control: Control<T, unknown>
  rules?: UseControllerProps<T>['rules']
  label: string
  type?: HTMLInputTypeAttribute
}

const RHFTextField = <T extends FieldValues>({ name, rules, control, ...props }: Props<T>): ReactElement => {
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
