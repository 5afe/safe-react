import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg } from 'src/theme/variables'

const styles = () =>
  createStyles({
    root: {
      paddingTop: lg,
      paddingBottom: '12px',
      lineHeight: 0,
    },
  })

const useStyles = makeStyles(styles)

type Props = {
  input: {
    name: string
    onChange?: () => void
    value: string
    placeholder: string
    type: string
  }
  meta: {
    touched?: boolean
    pristine?: boolean
    valid?: boolean
    error?: string
    modifiedSinceLastSubmit?: boolean
    submitError?: boolean
    active?: boolean
  }
  inputAdornment?: { endAdornment: React.ReactElement } | undefined
  multiline: boolean
  rows?: string
  testId: string
  text: string
  disabled?: boolean
  rowsMax?: number
  className?: string
  placeholder?: string
  InputLabelProps?: TextFieldProps['InputLabelProps']
}

const TextField = (props: Props): React.ReactElement => {
  const {
    input: { name, onChange, value, ...restInput },
    inputAdornment,
    meta,
    multiline,
    rows,
    testId,
    text,
    InputLabelProps: _InputLabelProps,
    ...rest
  } = props
  const classes = useStyles()
  const helperText = value ? text : undefined
  const showError = (meta.touched || !meta.pristine) && !meta.valid
  const hasError = !!meta.error || (!meta.modifiedSinceLastSubmit && !!meta.submitError)
  const errorMessage = meta.error || meta.submitError
  const isInactiveAndPristineOrUntouched = !meta.active && (meta.pristine || !meta.touched)
  const isInvalidAndUntouched = typeof meta.error === 'undefined' ? true : !meta.touched

  const disableUnderline = isInactiveAndPristineOrUntouched && isInvalidAndUntouched

  const inputRoot = helperText ? classes.root : ''
  const statusClasses = meta.valid ? 'isValid' : hasError && showError ? 'isInvalid' : ''
  const inputProps = {
    ...restInput,
    autoComplete: 'off',
    'data-testid': testId,
  }
  const inputRootProps = {
    ...inputAdornment,
    className: `${inputRoot} ${statusClasses}`,
    disableUnderline: disableUnderline,
  }
  const InputLabelProps = {
    ..._InputLabelProps,
    ...(rest?.placeholder && { shrink: true }),
  }

  return (
    <MuiTextField
      error={hasError && showError}
      helperText={hasError && showError ? errorMessage : helperText || ''}
      inputProps={inputProps} // blank in order to force to have helper text
      InputProps={inputRootProps}
      InputLabelProps={InputLabelProps}
      multiline={multiline}
      name={name}
      onChange={onChange}
      rows={rows}
      value={value}
      variant="outlined"
      {...rest}
    />
  )
}

export default TextField
