import { ReactElement } from 'react'
import { Control, FieldValues, Path, useController, UseControllerProps } from 'react-hook-form'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import TextField from '@material-ui/core/TextField/TextField'
import { SettingsInfo } from '@gnosis.pm/safe-react-gateway-sdk'

type Props<T> = {
  name: Path<T>
  control: Control<T, unknown>
  rules?: UseControllerProps<T>['rules']
  label: string
}

// TODO: Create enum in the types for these types
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

const isValidModule = (module: SettingsInfo['type']): string | undefined => {
  if (module && MODULES.every(({ type }) => type !== module)) {
    return 'Invalid module'
  }
}

const RHFModuleSearchField = <T extends FieldValues>({ name, control, ...props }: Props<T>): ReactElement => {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      validate: isValidModule,
    },
  })

  return (
    <Autocomplete
      options={MODULES}
      getOptionLabel={({ label }) => label}
      onChange={(_, module) => field.onChange(module?.type)}
      noOptionsText="No module found"
      renderInput={(params) => (
        <TextField
          innerRef={field.ref}
          {...params}
          {...props}
          name={name}
          variant="outlined"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  )
}

export default RHFModuleSearchField
