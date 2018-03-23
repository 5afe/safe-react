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
}: TextFieldProps) => {
  const helperText = value ? text : undefined

  return (
    <MuiTextField
      {...rest}
      name={name}
      helperText={meta.touched ? meta.error : helperText}
      error={meta.error && meta.touched}
      inputProps={restInput}
      onChange={onChange}
      value={value}
      fullWidth
    />
  )
}

export default TextField
