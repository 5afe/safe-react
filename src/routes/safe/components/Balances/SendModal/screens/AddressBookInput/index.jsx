// @flow
import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { styles } from './style'
import { getAddressBookListSelector } from '~/logic/addressBook/store/selectors'
import { mustBeEthereumAddress } from '~/components/forms/validator'


type Props = {
  classes: Object,
}


const AddressBookInput = ({ classes }: Props) => {
  const addressBook = useSelector(getAddressBookListSelector)
  const adbkNames = addressBook.toJS().map((entry) => entry.name)
  const [addressInput, setAddressInput] = useState(null)
  const [isValidForm, setIsValidForm] = useState(true)
  const [validationTxt, setValidationText] = useState(true)
  useEffect(() => {
    if (addressInput) {
      const isValidText = mustBeEthereumAddress(addressInput)
      setIsValidForm(isValidText === undefined)
      setValidationText(isValidText)
    }
  }, [addressInput])

  return (
    <>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={adbkNames}
        style={{ display: 'flex', flexGrow: 1 }}
        closeIcon={null}
        renderOption={(option) => (
          <>
            <p>asd</p>
            <span>{option}</span>
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={!isValidForm ? validationTxt : 'Recipient*'}
            error={!isValidForm}
            fullWidth
            variant="filled"
            id="filled-error-helper-text"
            onChange={(event) => {
              setAddressInput(event.target.value)
            }}
            InputLabelProps={{
              shrink: true,
              required: true,
            }}
          />
        )}
      />
    </>
  )
}

export default withStyles(styles)(AddressBookInput)
