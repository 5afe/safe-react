import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Select, { SelectProps } from '@material-ui/core/Select'
import { FieldMetaState } from 'react-final-form'
import { FormControlProps } from '@material-ui/core/FormControl/FormControl'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  paper: {
    background: '#000',
    padding: '3px 5px',
    border: '2px solid #60fc99',
  },
})

const style = {
  minWidth: '100%',
}

type Props = {
  classes: SelectProps['classes']
  label: SelectProps['label']
  renderValue: SelectProps['renderValue']
  disableError: boolean
  formControlProps: FormControlProps
  input: {
    name: string
    onChange?: () => void
    value: string
    placeholder: string
    type: string
  }
  meta: FieldMetaState<any>
}

const SelectInput = ({
  classes,
  disableError,
  formControlProps,
  input: { name, onChange, value, ...restInput },
  label,
  meta,
  renderValue,
  ...rest
}: Props): React.ReactElement => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched && !disableError
  const inputProps = {
    ...restInput,
    name,
  }

  const listClasses = useStyles()

  return (
    <FormControl {...formControlProps} error={showError} style={style}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        MenuProps={{
          classes: {
            paper: listClasses.paper,
          },
        }}
        classes={classes}
        inputProps={inputProps}
        onChange={onChange}
        renderValue={renderValue}
        value={value}
        variant="outlined"
        {...rest}
      />
      {showError && <FormHelperText>{meta.error || meta.submitError}</FormHelperText>}
    </FormControl>
  )
}

export default SelectInput
