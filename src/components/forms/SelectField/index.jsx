// @flow
import React from 'react'
import Select, { type SelectFieldProps } from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

const style = {
  minWidth: '100%',
}

const SelectInput = ({
  input: {
    name, value, onChange, ...restInput
  },
  meta,
  label,
  formControlProps,
  classes,
  renderValue,
  disableError,
  ...rest
}: SelectFieldProps) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched && !disableError
  const inputProps = {
    ...restInput,
    name,
  }

  return (
    <FormControl {...formControlProps} error={showError} style={style}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        classes={classes}
        onChange={onChange}
        renderValue={renderValue}
        inputProps={inputProps}
        value={value}
        {...rest}
      />
      {showError && <FormHelperText>{meta.error || meta.submitError}</FormHelperText>}
    </FormControl>
  )
}

export default SelectInput
