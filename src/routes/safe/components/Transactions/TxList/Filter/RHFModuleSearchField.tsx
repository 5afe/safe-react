import { ReactElement } from 'react'
import { Control, FieldValues, Path, useController, UseControllerProps } from 'react-hook-form'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import TextField from '@material-ui/core/TextField/TextField'
import { SettingsInfoType } from '@gnosis.pm/safe-react-gateway-sdk'

type Props<T> = {
  name: Path<T>
  control: Control<T, unknown>
  rules?: UseControllerProps<T>['rules']
  label: string
}

// TODO: Create enum in the types for these types
const MODULES: { label: string; type: SettingsInfoType }[] = [
  {
    type: SettingsInfoType.SET_FALLBACK_HANDLER,
    label: 'Set fallback handler',
  },
  {
    type: SettingsInfoType.ADD_OWNER,
    label: 'Add owner',
  },
  {
    type: SettingsInfoType.REMOVE_OWNER,
    label: 'Remove owner',
  },
  {
    type: SettingsInfoType.SWAP_OWNER,
    label: 'Swap owner',
  },
  {
    type: SettingsInfoType.CHANGE_THRESHOLD,
    label: 'Change required confirmations',
  },
  {
    type: SettingsInfoType.CHANGE_IMPLEMENTATION,
    label: 'Change implementation',
  },
  {
    type: SettingsInfoType.ENABLE_MODULE,
    label: 'Enable module',
  },
  {
    type: SettingsInfoType.DISABLE_MODULE,
    label: 'Disable module',
  },
  {
    type: SettingsInfoType.SET_GUARD,
    label: 'Set guard',
  },
  {
    type: SettingsInfoType.DELETE_GUARD,
    label: 'Delete guard',
  },
]

const isValidModule = (module: SettingsInfoType): string | undefined => {
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
