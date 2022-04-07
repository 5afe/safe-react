import { ComponentProps, HTMLInputTypeAttribute, ReactElement } from 'react'
import { Control, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField/TextField'

type Props = {
  name: string
  control: Control<any, unknown>
  rules?: ComponentProps<typeof Controller>['rules']
  label: string
  type?: HTMLInputTypeAttribute
}

const RHFTextField = ({ name, rules, control, ...props }: Props): ReactElement => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { ref, ...field }, fieldState }) => (
      <TextField
        innerRef={ref}
        {...field}
        {...props}
        variant="outlined"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        InputLabelProps={{ shrink: props.type === 'date' || Boolean(field.value) }}
      />
    )}
  />
)

export default RHFTextField
