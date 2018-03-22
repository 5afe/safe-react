// @flow
import React from 'react'
import MuiTextField, { TextFieldProps } from 'material-ui/TextField'

const TextField = ({
  input: {
    name, onChange, value, ...restInput
  },
  meta,
  render,
  text,
  ...rest
<<<<<<< b007d561f6319d9dadc9b39b0a0517b028e2e1d7
}: TextFieldProps) => {
  const helperText = value ? text : undefined
  const showError = meta.touched && !meta.valid

  return (
    <MuiTextField
      {...rest}
      name={name}
      helperText={showError ? meta.error : helperText}
      error={meta.error && meta.touched}
      inputProps={restInput}
      onChange={onChange}
      value={value}
      fullWidth
    />
  )
}
=======
}: TextFieldProps) => (
  <MuiTextField
    {...rest}
    name={name}
    helperText={meta.touched ? meta.error : undefined}
    error={meta.error && meta.touched}
    inputProps={restInput}
    onChange={onChange}
    value={value}
    fullWidth
  />
)
>>>>>>> WA-229 Adding fullWidth property to TextField by default

export default TextField
