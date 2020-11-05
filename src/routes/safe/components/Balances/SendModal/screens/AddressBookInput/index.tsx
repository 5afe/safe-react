import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import MuiTextField from '@material-ui/core/TextField'
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete'
import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { mustBeEthereumAddress } from 'src/components/forms/validator'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { filterContractAddressBookEntries, filterAddressEntries } from 'src/logic/addressBook/utils'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'
import { getAddressFromENS } from 'src/logic/wallets/getWeb3'
import {
  useTextFieldInputStyle,
  useTextFieldLabelStyle,
} from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput/style'
import { trimSpaces } from 'src/utils/strings'

export interface AddressBookProps {
  fieldMutator: (address: string) => void
  pristine?: boolean
  recipientAddress?: string
  setIsValidAddress: (valid: boolean) => void
  setSelectedEntry: Dispatch<SetStateAction<{ address: string; name: string }> | null>
}

type BaseAddressBookInputProps = AddressBookProps & {
  addressBookEntries: AddressBookEntry[]
}

const BaseAddressBookInput = ({
  addressBookEntries,
  fieldMutator,
  setIsValidAddress,
  setSelectedEntry,
}: BaseAddressBookInputProps): ReactElement => {
  const [validationText, setValidationText] = useState<string>('')

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

        if (normalizedValue) {
          if (isValidEnsName(normalizedValue)) {
            const address = await getAddressFromENS(normalizedValue).catch(() => normalizedValue)

            const validatedAddress = validateAddress(address)

            if (!validatedAddress) {
              fieldMutator('')
              return
            }

            const newEntry =
              typeof validatedAddress === 'string' ? { address, name: normalizedValue } : validatedAddress

            updateAddressInfo(newEntry)
          } else {
            const validatedAddress = validateAddress(normalizedValue)

            if (!validatedAddress) {
              fieldMutator('')
              return
            }

            const newEntry =
              typeof validatedAddress === 'string' ? { address: validatedAddress, name: '' } : validatedAddress

            updateAddressInfo(newEntry)
          }
        }
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
      renderInput={(params) => (
        <MuiTextField
          {...params}
          autoFocus={true}
          error={!!validationText}
          fullWidth
          id="filled-error-helper-text"
          variant="filled"
          label={validationText ? validationText : 'Recipient'}
          InputLabelProps={{ shrink: true, required: true, classes: labelStyles }}
          InputProps={{ ...params.InputProps, classes: inputStyles }}
        />
      )}
      getOptionLabel={({ address }) => address}
      renderOption={({ address, name }) => <EthHashInfo hash={address} name={name} showIdenticon />}
      role="listbox"
      style={{ display: 'flex', flexGrow: 1 }}
    />
  )
}

export const AddressBookInput = (props: AddressBookProps): ReactElement => {
  const addressBookEntries = useSelector(addressBookSelector)
  return <BaseAddressBookInput addressBookEntries={addressBookEntries} {...props} />
}

export const ContractsAddressBookInput = (props: AddressBookProps): ReactElement => {
  const addressBookEntries = useSelector(addressBookSelector)
  const [filteredEntries, setFilteredEntries] = useState<AddressBookEntry[]>([])

  useEffect(() => {
    const filterContractAddresses = async (): Promise<void> => {
      const filteredADBK = await filterContractAddressBookEntries(addressBookEntries)
      setFilteredEntries(filteredADBK)
    }
    filterContractAddresses()
  }, [addressBookEntries])

  return <BaseAddressBookInput addressBookEntries={filteredEntries} {...props} />
}
