// @flow
import React from 'react'
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'

// Neded for solving a fix in Windows browsers
const overflowStyle = {
  overflow: 'hidden',
}

class TextField extends React.PureComponent<TextFieldProps> {
  render() {
    const {
      input: {
        name, onChange, value, ...restInput
      },
      meta,
      render,
      text,
      ...rest
    } = this.props
    const helperText = value ? text : undefined
    const showError = (meta.touched || !meta.pristine) && !meta.valid

    return (
      <MuiTextField
        style={overflowStyle}
        {...rest}
        name={name}
        helperText={showError ? meta.error : helperText}
        error={meta.error && (meta.touched || !meta.pristine)}
        inputProps={restInput}
        onChange={onChange}
        value={value}
        fullWidth
      />
    )
  }
}

export default TextField
