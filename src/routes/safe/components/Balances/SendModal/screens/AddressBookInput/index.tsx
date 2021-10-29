import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import MuiTextField from '@material-ui/core/TextField'
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete'
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import InputAdornment from '@material-ui/core/InputAdornment'

import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { isFeatureEnabled } from 'src/config'
import { FEATURES } from 'src/config/networks/network.d'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { filterContractAddressBookEntries, filterAddressEntries } from 'src/logic/addressBook/utils'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import {
  useTextFieldInputStyle,
  useTextFieldLabelStyle,
} from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput/style'
import { trimSpaces } from 'src/utils/strings'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { checksumAddress } from 'src/utils/checksumAddress'
import { currentChainId } from 'src/logic/config/store/selectors'
import useNetworkPrefixedAddressInput from 'src/logic/hooks/useNetworkPrefixedAddressInput'
import { fontColor } from 'src/theme/variables'

export interface AddressBookProps {
  fieldMutator: (address: string) => void
  label?: string
  pristine?: boolean
  recipientAddress?: string
  errorMsg?: string
  setIsValidAddress: (valid: boolean) => void
  setSelectedEntry: Dispatch<SetStateAction<{ address: string; name: string }> | null>
}

export interface BaseAddressBookInputProps extends AddressBookProps {
  addressBookEntries: AddressBookEntry[]
  setSelectedEntry: (args: { address: string; name: string } | null) => void
  setValidationText: Dispatch<SetStateAction<string | undefined>>
  validationText: string | undefined
}

const BaseAddressBookInput = ({
  addressBookEntries,
  fieldMutator,
  label = 'Recipient',
  setIsValidAddress,
  setSelectedEntry,
  setValidationText,
  validationText,
}: BaseAddressBookInputProps): ReactElement => {
  const networkId = useSelector(currentChainId)

  const updateAddressInfo = (addressEntry: AddressBookEntry): void => {
    setSelectedEntry(addressEntry)
    fieldMutator(addressEntry.address)
  }

  const {
    networkPrefix,
    updateNetworkPrefix,
    showNetworkPrefix,
    networkPrefixError,
    restoreNetworkPrefix,
    networkPrefixValidationWithCache,
    onCopyPrefixedAddressField,
    getAddressWithoutPrefix,
  } = useNetworkPrefixedAddressInput()

  const validateAddress = (value: string): AddressBookEntry | string | undefined => {
    const address = getAddressWithoutPrefix(value)
    const addressErrorMessage = mustBeEthereumAddress(address)
    setIsValidAddress(!addressErrorMessage)

    if (addressErrorMessage) {
      setValidationText(addressErrorMessage)
      return
    }

    const prefixErrorMessage = networkPrefixValidationWithCache(value)
    setIsValidAddress(!prefixErrorMessage)

    if (prefixErrorMessage) {
      setValidationText(prefixErrorMessage)
      return
    }

    // Automatically checksum valid addresses
    let checkedAddr: string
    try {
      checkedAddr = checksumAddress(address)
    } catch (err) {
      checkedAddr = address
    }

    setValidationText('')

    const filteredEntries = filterAddressEntries(addressBookEntries, { inputValue: checkedAddr })
    return filteredEntries.length === 1 ? filteredEntries[0] : checkedAddr
  }

  const onChange: AutocompleteProps<AddressBookEntry, false, false, true>['onChange'] = (_, value, reason) => {
    switch (reason) {
      case 'select-option': {
        const { address, name, chainId } = value as AddressBookEntry
        updateAddressInfo({ address, name, chainId })
        break
      }
    }
  }

  const onInputChange: AutocompleteProps<AddressBookEntry, false, false, true>['onInputChange'] = async (
    _,
    value,
    reason,
  ) => {
    switch (reason) {
      case 'input': {
        const normalizedValue = trimSpaces(value)
        updateNetworkPrefix(normalizedValue)

        if (!normalizedValue) {
          setValidationText('')
          break
        }

        // ENS-enabled resolve/validation
        if (
          isFeatureEnabled(FEATURES.DOMAIN_LOOKUP) &&
          (isValidEnsName(normalizedValue) || isValidCryptoDomainName(normalizedValue))
        ) {
          let address = ''
          try {
            address = await getAddressFromDomain(normalizedValue)
            restoreNetworkPrefix()
          } catch (err) {
            logError(Errors._101, err.message)
          }

          const validatedAddress = validateAddress(address)

          if (!validatedAddress) {
            fieldMutator('')
            break
          }

          const newEntry =
            typeof validatedAddress === 'string'
              ? {
                  address,
                  name: normalizedValue,
                  chainId: networkId,
                }
              : validatedAddress

          updateAddressInfo(newEntry)
          break
        }

        // ETH address validation
        const validatedAddress = validateAddress(normalizedValue)

        const addressWithoutPrefix = getAddressWithoutPrefix(normalizedValue)
        fieldMutator(addressWithoutPrefix)

        if (!validatedAddress) {
          fieldMutator('')
          break
        }

        const newEntry =
          typeof validatedAddress === 'string'
            ? {
                address: validatedAddress,
                name: '',
                chainId: networkId,
              }
            : validatedAddress

        updateAddressInfo(newEntry)

        break
      }
    }
  }

  const labelStyles = useTextFieldLabelStyle()
  const inputStyles = useTextFieldInputStyle()

  return (
    <Autocomplete<AddressBookEntry, false, false, true>
      closeIcon={null}
      openOnFocus={false}
      filterOptions={filterAddressEntries}
      freeSolo
      onChange={onChange}
      onInputChange={onInputChange}
      options={addressBookEntries}
      id="address-book-input"
      renderInput={(params) => {
        const inputProps = params.inputProps as any
        return (
          <MuiTextField
            {...params}
            autoFocus={true}
            error={!!validationText}
            fullWidth
            variant="filled"
            label={validationText ? validationText : label}
            InputLabelProps={{ shrink: true, required: true, classes: labelStyles }}
            InputProps={{
              ...params.InputProps,
              classes: inputStyles,
              startAdornment: showNetworkPrefix && (
                <InputAdornment position="start" style={{ marginTop: 0 }}>
                  <NetWorkPrefixLabel error={networkPrefixError}>{networkPrefix}:</NetWorkPrefixLabel>
                </InputAdornment>
              ),
            }}
            inputProps={{
              ...params.inputProps,
              'data-testid': 'address-book-input',
              value: getAddressWithoutPrefix(inputProps.value), // we remove the prefix from input
              onCopy: onCopyPrefixedAddressField,
              onPaste: (e) => {
                const data = e.clipboardData.getData('Text')
                const target = e.target as any
                target.value = data
                // restore to default when paste
                restoreNetworkPrefix()
                onInputChange(e, data, 'input')
              },
            }}
          />
        )
      }}
      getOptionLabel={({ address }) => address}
      renderOption={({ address, name }) => <EthHashInfo hash={address} name={name} showAvatar />}
      role="listbox"
      style={{ display: 'flex', flexGrow: 1 }}
    />
  )
}

export const AddressBookInput = (props: AddressBookProps): ReactElement => {
  const addressBookEntries = useSelector(currentNetworkAddressBook)
  const [validationText, setValidationText] = useState<string>('')

  useEffect(() => {
    if (props.errorMsg) {
      setValidationText(props.errorMsg)
    }
  }, [props.errorMsg])

  return (
    <BaseAddressBookInput
      addressBookEntries={addressBookEntries}
      setValidationText={setValidationText}
      validationText={validationText}
      {...props}
    />
  )
}

export const ContractsAddressBookInput = ({
  setIsValidAddress,
  setSelectedEntry,
  ...props
}: AddressBookProps): ReactElement => {
  const addressBookEntries = useSelector(currentNetworkAddressBook)
  const [filteredEntries, setFilteredEntries] = useState<AddressBookEntry[]>([])
  const [validationText, setValidationText] = useState<string>('')

  useEffect(() => {
    const filterContractAddresses = async (): Promise<void> => {
      const filteredADBK = await filterContractAddressBookEntries(addressBookEntries)
      setFilteredEntries(filteredADBK)
    }
    filterContractAddresses()
  }, [addressBookEntries])

  const onSetSelectedEntry = async (selectedEntry) => {
    if (selectedEntry?.address) {
      // verify if `address` is a contract
      const contractAddressErrorMessage = await mustBeEthereumContractAddress(selectedEntry.address)
      setIsValidAddress(!contractAddressErrorMessage)
      setValidationText(contractAddressErrorMessage ?? '')
      setSelectedEntry(selectedEntry)
    }
  }

  return (
    <BaseAddressBookInput
      addressBookEntries={filteredEntries}
      setIsValidAddress={setIsValidAddress}
      setSelectedEntry={onSetSelectedEntry}
      setValidationText={setValidationText}
      validationText={validationText}
      {...props}
    />
  )
}

const NetWorkPrefixLabel = styled.span<{ error: boolean }>`
  color: ${(props) => (props.error ? 'red' : fontColor)};
`
