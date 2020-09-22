import MuiTextField from '@material-ui/core/TextField'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { trimSpaces } from 'src/utils/strings'

import { styles } from './style'

import Identicon from 'src/components/Identicon'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getAddressFromENS } from 'src/logic/wallets/getWeb3'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'
import { AddressBookEntry, AddressBookState } from 'src/logic/addressBook/model/addressBook'

export interface AddressBookProps {
  fieldMutator: (address: string) => void
  isCustomTx?: boolean
  pristine: boolean
  recipientAddress?: string
  setSelectedEntry: (
    entry: { address?: string; name?: string } | React.SetStateAction<{ address?: string; name? }> | null,
  ) => void
  setIsValidAddress: (valid: boolean) => void
}

const useStyles = makeStyles(styles)

const textFieldLabelStyle = makeStyles(() => ({
  root: {
    overflow: 'hidden',
    borderRadius: 4,
    fontSize: '15px',
    width: '500px',
  },
}))

const textFieldInputStyle = makeStyles(() => ({
  root: {
    fontSize: '14px',
    width: '420px',
  },
}))

const filterAddressBookWithContractAddresses = async (addressBook: AddressBookState): Promise<AddressBookEntry[]> => {
  const abFlags = await Promise.all(
    addressBook.map(
      async ({ address }: AddressBookEntry): Promise<boolean> => {
        return (await mustBeEthereumContractAddress(address)) === undefined
      },
    ),
  )

  return addressBook.filter((_, index) => abFlags[index])
}

const AddressBookInput = ({
  fieldMutator,
  isCustomTx,
  pristine,
  recipientAddress,
  setIsValidAddress,
  setSelectedEntry,
}: AddressBookProps): React.ReactElement => {
  const classes = useStyles()
  const addressBook = useSelector(addressBookSelector)
  const [isValidForm, setIsValidForm] = useState(true)
  const [validationText, setValidationText] = useState<string>('')
  const [inputTouched, setInputTouched] = useState(false)
  const [blurred, setBlurred] = useState(pristine)
  const [adbkList, setADBKList] = useState<AddressBookEntry[]>([])

  const [inputAddValue, setInputAddValue] = useState(recipientAddress)

  const onAddressInputChanged = async (value: string): Promise<void> => {
    const normalizedAddress = trimSpaces(value)
    const isENSDomain = isValidEnsName(normalizedAddress)
    setInputAddValue(normalizedAddress)
    let resolvedAddress = normalizedAddress
    let addressErrorMessage
    if (inputTouched && !normalizedAddress) {
      setIsValidForm(false)
      setValidationText('Required')
      setIsValidAddress(false)
      return
    }
    if (normalizedAddress) {
      if (isENSDomain) {
        resolvedAddress = await getAddressFromENS(normalizedAddress)
        setInputAddValue(resolvedAddress)
      }

      addressErrorMessage = mustBeEthereumAddress(resolvedAddress)
      if (isCustomTx && addressErrorMessage === undefined) {
        addressErrorMessage = await mustBeEthereumContractAddress(resolvedAddress)
      }

      // First removes the entries that are not contracts if the operation is custom tx
      const adbkToFilter = isCustomTx ? await filterAddressBookWithContractAddresses(addressBook) : addressBook
      // Then Filters the entries based on the input of the user
      const filteredADBK = adbkToFilter.filter((adbkEntry) => {
        const { address, name } = adbkEntry
        return (
          name.toLowerCase().includes(normalizedAddress.toLowerCase()) ||
          address.toLowerCase().includes(resolvedAddress.toLowerCase())
        )
      })
      setADBKList(filteredADBK)
      if (!addressErrorMessage) {
        // base case if isENSDomain we set the domain as the name
        // if address does not exist in address book we use blank name
        let addressName = isENSDomain ? normalizedAddress : ''

        // if address is valid, and is in the address book, then we use the stored values
        if (filteredADBK.length === 1) {
          const addressBookContact = filteredADBK[0]
          addressName = addressBookContact.name ?? addressName
        }

        setSelectedEntry({
          name: addressName,
          address: resolvedAddress,
        })
      }
    }
    setIsValidForm(addressErrorMessage === undefined)
    setValidationText(addressErrorMessage)
    fieldMutator(resolvedAddress)
    setIsValidAddress(addressErrorMessage === undefined)
  }

  useEffect(() => {
    const filterAdbkContractAddresses = async (): Promise<void> => {
      if (!isCustomTx) {
        setADBKList(addressBook)
        return
      }

      const filteredADBK = await filterAddressBookWithContractAddresses(addressBook)
      setADBKList(filteredADBK)
    }
    filterAdbkContractAddresses()
  }, [addressBook, isCustomTx])

  const labelStyling = textFieldLabelStyle()
  const txInputStyling = textFieldInputStyle()

  let statusClasses = ''
  if (!isValidForm) {
    statusClasses = 'isInvalid'
  }
  if (isValidForm && inputTouched) {
    statusClasses = 'isValid'
  }

  return (
    <>
      <Autocomplete
        closeIcon={null}
        openOnFocus={false}
        filterOptions={(optionsArray, { inputValue }) =>
          optionsArray.filter((item) => {
            const inputLowerCase = inputValue.toLowerCase()
            const foundName = item.name.toLowerCase().includes(inputLowerCase)
            const foundAddress = item.address?.toLowerCase().includes(inputLowerCase)
            return foundName || foundAddress
          })
        }
        freeSolo
        getOptionLabel={(adbkEntry) => adbkEntry.address || ''}
        id="free-solo-demo"
        onChange={(_, value: AddressBookEntry) => {
          let address = ''
          let name = ''
          if (value) {
            address = value.address
            name = value.name
          }
          setSelectedEntry({ address, name })
          fieldMutator(address)
        }}
        onClose={() => setBlurred(true)}
        onOpen={() => {
          setSelectedEntry(null)
          setBlurred(false)
        }}
        open={!blurred}
        options={adbkList}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            // eslint-disable-next-line
            autoFocus={!blurred || pristine}
            error={!isValidForm}
            fullWidth
            id="filled-error-helper-text"
            InputLabelProps={{
              shrink: true,
              required: true,
              classes: labelStyling,
            }}
            InputProps={{
              ...params.InputProps,
              classes: {
                ...txInputStyling,
              },
              className: statusClasses,
            }}
            label={!isValidForm ? validationText : 'Recipient'}
            onChange={(event) => {
              setInputTouched(true)
              onAddressInputChanged(event.target.value)
            }}
            value={{ address: inputAddValue }}
            variant="filled"
          />
        )}
        renderOption={(adbkEntry) => {
          const { address, name } = adbkEntry

          if (!address) {
            return
          }

          return (
            <div className={classes.itemOptionList}>
              <div className={classes.identicon}>
                <Identicon address={address} diameter={32} />
              </div>
              <div className={classes.adbkEntryName}>
                <span>{name}</span>
                <span>{address}</span>
              </div>
            </div>
          )
        }}
        role="listbox"
        style={{ display: 'flex', flexGrow: 1 }}
        value={{ address: inputAddValue, name: '' }}
      />
    </>
  )
}

export default AddressBookInput
