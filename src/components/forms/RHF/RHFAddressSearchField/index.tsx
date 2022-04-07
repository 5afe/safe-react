import { HTMLInputTypeAttribute, ReactElement, useState } from 'react'
import { Control, useController } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import { InputBaseComponentProps } from '@material-ui/core/InputBase/InputBase'
import TextField from '@material-ui/core/TextField/TextField'
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'

import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { showShortNameSelector } from 'src/logic/appearance/selectors'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import { isValidAddress } from 'src/utils/isValidAddress'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'

type Props = {
  name: string
  control: Control<any, unknown>
  label: string
  type?: HTMLInputTypeAttribute
}

const isValidRecipient = (address: string): string | undefined => {
  if (address && !isValidAddress(address)) {
    return 'Recipient not found'
  }
}

const RHFAddressSearchField = ({ name, control, ...props }: Props): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const addressBookOnChain = useSelector(currentNetworkAddressBook)

  const [isResolvingDomain, setIsResolvingDomain] = useState<boolean>(false)

  // RHF's `field` value stores the address, whereas the uncontrolled Autocomplete stores the input value
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      validate: isValidRecipient,
    },
  })

  const onInputChange = async (newValue: string) => {
    const addressBookEntry = addressBookOnChain.find(({ name }) => name === newValue)
    if (addressBookEntry) {
      field.onChange(addressBookEntry.address)
      return
    }

    const { address } = parsePrefixedAddress(newValue.trim())
    if (isValidEnsName(address) || isValidCryptoDomainName(address)) {
      setIsResolvingDomain(true)
      const resolvedAddress = await getAddressFromDomain(address)
      setIsResolvingDomain(false)

      field.onChange(resolvedAddress)
      return
    }

    field.onChange(newValue)
  }

  const formatValue = (value: string) => {
    const { prefix, address } = parsePrefixedAddress(value)
    if (isValidAddress(address)) {
      return showChainPrefix ? `${prefix}:${address}` : address
    }

    return value
  }

  return (
    <Autocomplete
      freeSolo
      options={addressBookOnChain}
      getOptionLabel={({ name }) => name}
      onInputChange={(_, value) => onInputChange(value)}
      renderInput={({ inputProps, InputProps, ...params }) => {
        const { value } = inputProps as InputBaseComponentProps
        return (
          <TextField
            innerRef={field.ref}
            {...params}
            {...props}
            name={name}
            variant="outlined"
            error={!!fieldState.error}
            // Show the address as helperText if the input value is an address book entry or domain
            helperText={
              fieldState.error?.message
                ? fieldState.error.message
                : field.value && field.value !== value
                ? formatValue(field.value)
                : undefined
            }
            inputProps={{
              ...inputProps,
              value: formatValue(value),
              readOnly: isResolvingDomain,
              className: undefined, // Remove style override
            }}
            InputProps={{
              ...InputProps,
              endAdornment: isResolvingDomain ? (
                <InputAdornment position="end">
                  <CircularProgress size="16px" />
                </InputAdornment>
              ) : (
                InputProps.endAdornment
              ),
            }}
          />
        )
      }}
    />
  )
}

export default RHFAddressSearchField
