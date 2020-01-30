// @flow
import React, { useState, useEffect } from 'react'
import {
  withStyles,
} from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { styles } from './style'
import { getAddressBookListSelector } from '~/logic/addressBook/store/selectors'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from '~/components/forms/validator'
import Identicon from '~/components/Identicon'


type Props = {
  classes: Object,
  fieldMutator: Function,
  setSelectedEntry: Function,
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

const AddressBookInput = ({
  classes, fieldMutator, isCustomTx, recipientAddress, setSelectedEntry, pristine,
}: Props) => {
  const addressBook = useSelector(getAddressBookListSelector)
  const [addressInput, setAddressInput] = useState(recipientAddress)
  const [isValidForm, setIsValidForm] = useState(true)
  const [validationText, setValidationText] = useState(true)
  const [inputTouched, setInputTouched] = useState(false)
  const [blurred, setBlurred] = useState(pristine)

  useEffect(() => {
    const validate = async () => {
      if (inputTouched && !addressInput) {
        setIsValidForm(false)
        setValidationText('Required')
      } else if (addressInput) {
        let isValidText = mustBeEthereumAddress(addressInput)
        if (isCustomTx && isValidText === undefined) {
          isValidText = await mustBeEthereumContractAddress(addressInput)
        }
        setIsValidForm(isValidText === undefined)
        setValidationText(isValidText)
        fieldMutator(addressInput)
      }
    }
    validate()
  }, [addressInput])

  const labelStyling = textFieldLabelStyle()
  const txInputStyling = textFieldInputStyle()

  return (
    <>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        disableOpenOnFocus
        open={!blurred}
        onClose={() => setBlurred(true)}
        role="listbox"
        options={addressBook.toArray()}
        style={{ display: 'flex', flexGrow: 1 }}
        closeIcon={null}
        filterOptions={(optionsArray, { inputValue }) => optionsArray.filter((item) => {
          const inputLowerCase = inputValue.toLowerCase()
          const foundName = item.name.toLowerCase()
            .includes(inputLowerCase)
          const foundAddress = item.address.toLowerCase().includes(inputLowerCase)
          return foundName || foundAddress
        })}
        getOptionLabel={(adbkEntry) => adbkEntry.address || ''}
        onOpen={() => {
          setSelectedEntry(null)
          setBlurred(false)
        }}
        defaultValue={{ address: recipientAddress }}
        onChange={(event, value) => {
          let address = ''
          let name = ''
          if (value) {
            address = value.address
            name = value.name
          }
          setAddressInput(address)
          setSelectedEntry({ address, name })
          fieldMutator(address)
        }}
        renderOption={(adbkEntry) => {
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
        renderInput={(params) => (
          <TextField
            {...params}
            label={!isValidForm ? validationText : 'Recipient'}
            error={!isValidForm}
            fullWidth
            autoFocus={!blurred || pristine}
            variant="filled"
            id="filled-error-helper-text"
            onChange={(event) => {
              setInputTouched(true)
              setAddressInput(event.target.value)
            }}
            InputProps={
              {
                ...params.InputProps,
                classes: {
                  ...txInputStyling,
                },
              }
            }
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
