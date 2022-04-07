import { ComponentProps, HTMLInputTypeAttribute, ReactElement } from 'react'
import { Control, Controller, useController } from 'react-hook-form'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import TextField from '@material-ui/core/TextField/TextField'
import { SettingsInfo } from '@gnosis.pm/safe-react-gateway-sdk'

type Props = {
  name: string
  control: Control<any, unknown>
  rules?: ComponentProps<typeof Controller>['rules']
  label: string
  type?: HTMLInputTypeAttribute
}

// TODO: Centralise these with `TxInfoSettings`
const MODULES: { label: string; type: SettingsInfo['type'] }[] = [
  {
    type: 'SET_FALLBACK_HANDLER',
    label: 'Set fallback handler',
  },
  {
    type: 'ADD_OWNER',
    label: 'Add owner',
  },
  {
    type: 'REMOVE_OWNER',
    label: 'Remove owner',
  },
  {
    type: 'SWAP_OWNER',
    label: 'Swap owner',
  },
  {
    type: 'CHANGE_THRESHOLD',
    label: 'Change required confirmations',
  },
  {
    type: 'CHANGE_IMPLEMENTATION',
    label: 'Change implementation',
  },
  {
    type: 'ENABLE_MODULE',
    label: 'Enable module',
  },
  {
    type: 'DISABLE_MODULE',
    label: 'Disable module',
  },
  {
    type: 'SET_GUARD',
    label: 'Set guard',
  },
  {
    type: 'DELETE_GUARD',
    label: 'Delete guard',
  },
]

const RHFModuleSearchField = ({ name, control, ...props }: Props): ReactElement => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      validate: (module: string) => (module ? MODULES.some(({ type }) => type === module) : true) || 'Invalid module',
    },
  })

  return (
    <Autocomplete
      options={MODULES}
      getOptionLabel={({ label }) => label}
      onChange={(_, module) => field.onChange(module?.type || undefined)}
      noOptionsText="No module found"
      renderInput={({ inputProps, ...params }) => (
        <TextField
          innerRef={field.ref}
          {...params}
          {...props}
          name={name}
          variant="outlined"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          inputProps={{
            ...inputProps,
            className: undefined, // Remove style override
          }}
        />
      )}
    />
  )
}

export default RHFModuleSearchField
