import { ReactElement, useState } from 'react'
import { FieldValues, Path, useController, UseFormReturn } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import TextField from '@material-ui/core/TextField/TextField'
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'

import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { showShortNameSelector } from 'src/logic/appearance/selectors'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import { isValidAddress } from 'src/utils/isValidAddress'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'

type Props<T> = {
  name: Path<T>
  hiddenName: Path<T>
  methods: UseFormReturn<T>
  label: string
}

const RHFAddressSearchField = <T extends FieldValues>({
  name,
  hiddenName,
  methods: { control, register },
  label,
  ...props
}: Props<T>): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const addressBookOnChain = useSelector(currentNetworkAddressBook)

  const [isResolving, setIsResolving] = useState<boolean>(false)

  // Field that holds the address value
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: {
      validate: (address) => {
        if (address && !isValidAddress(address)) {
          return `${label} not found`
        }
      },
    },
  })

  // Field that holds the input value
  const { field: hiddenField } = useController({
    name: hiddenName,
    control,
  })

  // On autocomplete selection/text input find address from address book/resolve ENS domain
  const onInputChange = async (newValue: string) => {
    hiddenField.onChange(newValue)

    const addressBookEntry = addressBookOnChain.find(({ name }) => name === newValue)
    if (addressBookEntry) {
      field.onChange(addressBookEntry.address)
      return
    }

    const { address } = parsePrefixedAddress(newValue.trim())
    if (isValidEnsName(address) || isValidCryptoDomainName(address)) {
      let resolvedAddress: string | undefined
      setIsResolving(true)
      try {
        resolvedAddress = await getAddressFromDomain(address)
      } catch {}
      setIsResolving(false)

      if (resolvedAddress) {
        field.onChange(resolvedAddress)
        return
      }
    }

    field.onChange(newValue)
  }

  const formatRenderedValue = (value: string) => {
    const { prefix, address } = parsePrefixedAddress(value)
    if (isValidAddress(address)) {
      return showChainPrefix ? `${prefix}:${address}` : address
    }

    return value
  }

  return (
    <>
      <input type="hidden" {...register(hiddenName)} />
      <Autocomplete
        freeSolo
        options={addressBookOnChain}
        getOptionLabel={({ name }) => name}
        onInputChange={(_, value) => onInputChange(value)}
        renderInput={({ inputProps, InputProps, ...params }) => (
          <TextField
            innerRef={field.ref}
            {...params}
            {...props}
            label={label}
            name={name}
            variant="outlined"
            error={!!fieldState.error}
            // Show the address as helperText if the hidden value is an address book entry or domain
            helperText={
              fieldState.error?.message
                ? fieldState.error.message
                : field.value !== hiddenField.value
                ? formatRenderedValue(field.value)
                : undefined
            }
            inputProps={{
              ...inputProps,
              value: formatRenderedValue(hiddenField.value),
              readOnly: isResolving,
            }}
            InputProps={{
              ...InputProps,
              endAdornment: isResolving ? (
                <InputAdornment position="end">
                  <CircularProgress size="16px" />
                </InputAdornment>
              ) : (
                InputProps.endAdornment
              ),
            }}
          />
        )}
      />
    </>
  )
}

export default RHFAddressSearchField
