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
  setSelectedAddress: Function,
  isCustomTx?: boolean,
  recipientAddress?: string,
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
  classes, fieldMutator, isCustomTx, recipientAddress, setSelectedAddress,
}: Props) => {
  const addressBook = useSelector(getAddressBookListSelector)
  const [addressInput, setAddressInput] = useState(recipientAddress)
  const [isValidForm, setIsValidForm] = useState(true)
  const [validationTxt, setValidationText] = useState(true)
  useEffect(() => {
    const validate = async () => {
      if (addressInput) {
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
        onOpen={() => setSelectedAddress(null)}
        defaultValue={{ address: recipientAddress }}
        onChange={(event, value) => {
          const { address } = value
          setAddressInput(address)
          setSelectedAddress(address)
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
            label={!isValidForm ? validationTxt : 'Recipient'}
            error={!isValidForm}
            fullWidth
            variant="filled"
            id="filled-error-helper-text"
            onChange={(event) => {
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
