// @flow
import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import MuiTextField from '@material-ui/core/TextField'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { List } from 'immutable'
import { styles } from './style'
import { getAddressBookListSelector } from '~/logic/addressBook/store/selectors'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from '~/components/forms/validator'
import Identicon from '~/components/Identicon'
import { getAddressFromENS } from '~/logic/wallets/getWeb3'

type Props = {
  classes: Object,
  fieldMutator: Function,
  setSelectedEntry: Function,
  setIsValidAddress: Function,
  isCustomTx?: boolean,
  recipientAddress?: string,
  pristine: boolean,
}

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

const filterAddressBookWithContractAddresses = async addressBook => {
  const abFlags = await Promise.all(
    addressBook.map(async ({ address }) => {
      return (await mustBeEthereumContractAddress(address)) === undefined
    }),
  )
  return addressBook.filter((adbkEntry, index) => abFlags[index])
}

const isValidEnsName = name => /^([\w-]+\.)+(eth|test|xyz|luxe)$/.test(name)

const AddressBookInput = ({
  classes,
  fieldMutator,
  isCustomTx,
  recipientAddress,
  setSelectedEntry,
  pristine,
  setIsValidAddress,
}: Props) => {
  const addressBook = useSelector(getAddressBookListSelector)
  const [isValidForm, setIsValidForm] = useState(true)
  const [validationText, setValidationText] = useState(true)
  const [inputTouched, setInputTouched] = useState(false)
  const [blurred, setBlurred] = useState(pristine)
  const [adbkList, setADBKList] = useState(List([]))

  const [inputAddValue, setInputAddValue] = useState(recipientAddress)

  const onAddressInputChanged = async addressValue => {
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
      const filteredADBK = adbkToFilter.filter(adbkEntry => {
        const { name, address } = adbkEntry
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
  }, [addressBook])

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
        id="free-solo-demo"
        freeSolo
        disableOpenOnFocus
        open={!blurred}
        onClose={() => setBlurred(true)}
        role="listbox"
        options={adbkList.toArray()}
        style={{ display: 'flex', flexGrow: 1 }}
        closeIcon={null}
        filterOptions={(optionsArray, { inputValue }) =>
          optionsArray.filter(item => {
            const inputLowerCase = inputValue.toLowerCase()
            const foundName = item.name.toLowerCase().includes(inputLowerCase)
            const foundAddress = item.address.toLowerCase().includes(inputLowerCase)
            return foundName || foundAddress
          })
        }
        getOptionLabel={adbkEntry => adbkEntry.address || ''}
        onOpen={() => {
          setSelectedEntry(null)
          setBlurred(false)
        }}
        //  defaultValue={{ address: recipientAddress }}
        value={{ address: inputAddValue }}
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
        renderOption={adbkEntry => {
          const { name, address } = adbkEntry
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
        renderInput={params => (
          <MuiTextField
            {...params}
            label={!isValidForm ? validationText : 'Recipient'}
            error={!isValidForm}
            fullWidth
            autoFocus={!blurred || pristine}
            variant="filled"
            id="filled-error-helper-text"
            value={{ address: inputAddValue }}
            onChange={event => {
              setInputTouched(true)
              onAddressInputChanged(event.target.value)
            }}
            InputProps={{
              ...params.InputProps,
              classes: {
                ...txInputStyling,
              },
              className: `${statusClasses}`,
            }}
            InputLabelProps={{
              shrink: true,
              required: true,
              classes: labelStyling,
            }}
          />
        )}
      />
    </>
  )
}

export default withStyles(styles)(AddressBookInput)
