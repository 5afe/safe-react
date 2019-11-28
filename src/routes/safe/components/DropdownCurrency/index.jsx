// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { useDispatch } from 'react-redux'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'

const styles = () => ({
  dropdownContainer: {

  },
})

const DropdownCurrency = ({
  classes,
}: Props) => {
  const currenciesList = Object.values(AVAILABLE_CURRENCIES)

  const dispatch = useDispatch()

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName) => {
    dispatch(setCurrencySelected(newCurrencySelectedName))
  }


  return (
    <FormControl variant="filled" className={classes.dropdownContainer}>
      <Select
        native
        onChange={(event) => onCurrentCurrencyChangedHandler(event.target.value)}
      >
        {currenciesList.map((currency) => (
          <option key={currency}>{currency}</option>
        ))}
      </Select>
    </FormControl>
  )
}
export default withStyles(styles)(DropdownCurrency)
