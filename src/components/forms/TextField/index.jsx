// @flow
import React from 'react'
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { lg } from '~/theme/variables'

// Neded for solving a fix in Windows browsers
const overflowStyle = {
  overflow: 'hidden',
  width: '100%',
}

const styles = () => ({
  root: {
    paddingTop: lg,
    paddingBottom: '12px',
    lineHeight: 0,
  },
})

class TextField extends React.PureComponent<TextFieldProps> {
  render() {
    const {
      input: {
        name, onChange, value, ...restInput
      },
      meta,
      render,
      text,
      classes,
      ...rest
    } = this.props
    const helperText = value ? text : undefined
    const showError = (meta.touched || !meta.pristine) && !meta.valid
    const underline = meta.active || (meta.visited && !meta.valid)

    const inputRoot = helperText ? classes.root : undefined
    const inputProps = { ...restInput, autocomplete: 'off' }
    const inputRootProps = { disableUnderline: !underline, className: inputRoot }

    return (
      <MuiTextField
        style={overflowStyle}
        {...rest}
        name={name}
        helperText={showError ? meta.error : helperText || ' '} // blank in order to force to have helper text
        error={meta.error && (meta.touched || !meta.pristine)}
        InputProps={inputRootProps}
        // eslint-disable-next-line
        inputProps={inputProps}
        onChange={onChange}
        value={value}
      />
    )
  }
}

export default withStyles(styles)(TextField)
