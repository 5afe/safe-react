import MuiTextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { List } from 'immutable'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Identicon from 'src/components/Identicon'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { getAddressBookListSelector } from 'src/logic/addressBook/store/selectors'
import { getAddressFromENS } from 'src/logic/wallets/getWeb3'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'

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

const filterAddressBookWithContractAddresses = async (addressBook) => {
  const abFlags = await Promise.all(
    addressBook.map(async ({ address }) => {
      return (await mustBeEthereumContractAddress(address)) === undefined
    }),
  )
  return addressBook.filter((adbkEntry, index) => abFlags[index])
}

const AddressBookInput = ({
  classes,
  fieldMutator,
  isCustomTx,
  pristine,
  recipientAddress,
  setIsValidAddress,
  setSelectedEntry,
}: any) => {
  const addressBook = useSelector(getAddressBookListSelector)
  const [isValidForm, setIsValidForm] = useState(true)
  const [validationText, setValidationText] = useState<any>(true)
  const [inputTouched, setInputTouched] = useState(false)
  const [blurred, setBlurred] = useState(pristine)
  const [adbkList, setADBKList] = useState(List([]))

  const [inputAddValue, setInputAddValue] = useState(recipientAddress)

  const onAddressInputChanged = async (addressValue) => {
    setInputAddValue(addressValue)
    let resolvedAddress = addressValue
    let isValidText
    if (inputTouched && !addressValue) {
      setIsValidForm(false)
      setValidationText('Required')
      setIsValidAddress(false)
      return
    }
    if (addressValue) {
      if (isValidEnsName(addressValue)) {
        resolvedAddress = await getAddressFromENS(addressValue)
        setInputAddValue(resolvedAddress)
      }
      isValidText = mustBeEthereumAddress(resolvedAddress)
      if (isCustomTx && isValidText === undefined) {
        isValidText = await mustBeEthereumContractAddress(resolvedAddress)
      }

      // First removes the entries that are not contracts if the operation is custom tx
      const adbkToFilter = isCustomTx ? await filterAddressBookWithContractAddresses(addressBook) : addressBook
      // Then Filters the entries based on the input of the user
      const filteredADBK = adbkToFilter.filter((adbkEntry) => {
        const { address, name } = adbkEntry
        return (
          name.toLowerCase().includes(addressValue.toLowerCase()) ||
          address.toLowerCase().includes(addressValue.toLowerCase())
        )
      })
      setADBKList(filteredADBK)
    }
    setIsValidForm(isValidText === undefined)
    setValidationText(isValidText)
    fieldMutator(resolvedAddress)
    setIsValidAddress(isValidText === undefined)
  }

  useEffect(() => {
    const filterAdbkContractAddresses = async () => {
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
        disableOpenOnFocus
        filterOptions={(optionsArray, { inputValue }) =>
          optionsArray.filter((item) => {
            const inputLowerCase = inputValue.toLowerCase()
            const foundName = item.name.toLowerCase().includes(inputLowerCase)
            const foundAddress = item.address.toLowerCase().includes(inputLowerCase)
            return foundName || foundAddress
          })
        }
        freeSolo
        getOptionLabel={(adbkEntry) => adbkEntry.address || ''}
        id="free-solo-demo"
        onChange={(event, value) => {
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
        options={adbkList.toArray()}
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
        value={{ address: inputAddValue }}
      />
    </>
  )
}

export default withStyles(styles as any)(AddressBookInput)
