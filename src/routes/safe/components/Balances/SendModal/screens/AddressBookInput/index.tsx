import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import MuiTextField from '@material-ui/core/TextField'
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete'
import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { isFeatureEnabled } from 'src/config'
import { FEATURES } from 'src/config/networks/network.d'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { filterContractAddressBookEntries, filterAddressEntries } from 'src/logic/addressBook/utils'
import { isValidEnsName, isValidCryptoDomainName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromDomain } from 'src/logic/wallets/getWeb3'
import {
  useTextFieldInputStyle,
  useTextFieldLabelStyle,
} from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput/style'
import { trimSpaces } from 'src/utils/strings'

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
  const updateAddressInfo = (addressEntry: AddressBookEntry): void => {
    setSelectedEntry(addressEntry)
    fieldMutator(addressEntry.address)
  }

  const validateAddress = (address: string): AddressBookEntry | string | undefined => {
    const addressErrorMessage = mustBeEthereumAddress(address)
    setIsValidAddress(!addressErrorMessage)

    if (addressErrorMessage) {
      setValidationText(addressErrorMessage)
      return
    }

    const filteredEntries = filterAddressEntries(addressBookEntries, { inputValue: address })
    return filteredEntries.length === 1 ? filteredEntries[0] : address
  }

  const onChange: AutocompleteProps<AddressBookEntry, false, false, true>['onChange'] = (_, value, reason) => {
    switch (reason) {
      case 'select-option': {
        const { address, name } = value as AddressBookEntry
        updateAddressInfo({ address, name })
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

        if (!normalizedValue) {
          break
        }

        // ENS-enabled resolve/validation
        if (
          isFeatureEnabled(FEATURES.DOMAIN_LOOKUP) &&
          (isValidEnsName(normalizedValue) || isValidCryptoDomainName(normalizedValue))
        ) {
          const address = await getAddressFromDomain(normalizedValue)

          const validatedAddress = validateAddress(address)

          if (!validatedAddress) {
            fieldMutator('')
            break
          }

          const newEntry = typeof validatedAddress === 'string' ? { address, name: normalizedValue } : validatedAddress

          updateAddressInfo(newEntry)
          break
        }

        // ETH address validation
        const validatedAddress = validateAddress(normalizedValue)

        if (!validatedAddress) {
          fieldMutator('')
          break
        }

        const newEntry =
          typeof validatedAddress === 'string' ? { address: validatedAddress, name: '' } : validatedAddress

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
      renderInput={(params) => (
        <MuiTextField
          {...params}
          autoFocus={true}
          error={!!validationText}
          fullWidth
          variant="filled"
          label={validationText ? validationText : label}
          InputLabelProps={{ shrink: true, required: true, classes: labelStyles }}
          InputProps={{ ...params.InputProps, classes: inputStyles }}
        />
      )}
      getOptionLabel={({ address }) => address}
      renderOption={({ address, name }) => <EthHashInfo hash={address} name={name} showAvatar />}
      role="listbox"
      style={{ display: 'flex', flexGrow: 1 }}
    />
  )
}

export const AddressBookInput = (props: AddressBookProps): ReactElement => {
  const addressBookEntries = useSelector(addressBookSelector)
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
  const addressBookEntries = useSelector(addressBookSelector)
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
