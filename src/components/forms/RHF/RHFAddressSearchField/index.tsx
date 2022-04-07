import { ComponentProps, HTMLInputTypeAttribute, ReactElement, useState } from 'react'
import { Control, Controller, useController } from 'react-hook-form'
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
  rules?: ComponentProps<typeof Controller>['rules']
  label: string
  type?: HTMLInputTypeAttribute
}

const RHFAddressSearchField = ({ name, rules, control, ...props }: Props): ReactElement => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const addressBookOnChain = useSelector(currentNetworkAddressBook)

  const [isResolvingDomain, setIsResolvingDomain] = useState<boolean>(false)

  // RHF's `field` value stores the address, whereas the uncontrolled Autocomplete stores the input value
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  })

  const onInputChange = async (newValue: string) => {
    if (!newValue) {
      field.onChange(undefined)
      return
    }

    const addressBookEntry = addressBookOnChain.find(({ name }) => name === newValue)
    if (addressBookEntry) {
      field.onChange(addressBookEntry.address)
      return
    }

    const { address } = parsePrefixedAddress(newValue)
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
    // Field has likely been reset
    if (field.value === undefined) {
      return ''
    }

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
      renderInput={({ inputProps, InputProps, ...params }) => (
        <TextField
          innerRef={field.ref}
          {...params}
          {...props}
          name={name}
          variant="outlined"
          error={!!fieldState.error}
          inputProps={{
            ...inputProps,
            value: formatValue((inputProps as InputBaseComponentProps).value),
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
      )}
    />
  )
}

export default RHFAddressSearchField
