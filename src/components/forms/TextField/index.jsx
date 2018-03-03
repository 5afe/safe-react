import React from 'react'
import {default as MuiTextField } from 'material-ui/TextField'

const TextField = ({
  input: { name, onChange, value, ...restInput },
  meta,
  render,
  ...rest
}) => (
  <MuiTextField
    {...rest}
    name={name}
    helperText={meta.touched ? meta.error : undefined}
    error={meta.error && meta.touched}
    inputProps={restInput}
    onChange={onChange}
    value={value}
  />
)

export default TextField
