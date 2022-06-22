import { HTMLInputTypeAttribute, ReactElement } from 'react'
import { Control, FieldValues, Path, useController, UseControllerProps } from 'react-hook-form'
import TextField from '@material-ui/core/TextField/TextField'

import { formatInputValue, getFilterHelperText } from 'src/routes/safe/components/Transactions/TxList/Filter/utils'

type Props<T> = {
  name: Path<T>
  control: Control<T, unknown>
  rules?: UseControllerProps<T>['rules']
  label: string
  type?: HTMLInputTypeAttribute
  // To disable date fields
  disabled?: boolean
  endAdornment?: ReactElement
}

const RHFTextField = <T extends FieldValues>({
  name,
  rules,
  control,
  type,
  endAdornment = undefined,
  ...props
}: Props<T>): ReactElement => {
  const {
    field: { ref, value, ...field },
    fieldState: { error },
  } = useController({
    name,
    rules,
    control,
  })

  return (
    <TextField
      innerRef={ref}
      value={formatInputValue(value)}
      {...field}
      type={type}
      {...props}
      variant="outlined"
      error={!!error}
      helperText={getFilterHelperText(value, error)}
      InputLabelProps={{ shrink: type === 'date' || !!value }}
      InputProps={{ endAdornment }}
    />
  )
}

export default RHFTextField
