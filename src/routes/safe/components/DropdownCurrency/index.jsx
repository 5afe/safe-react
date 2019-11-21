// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { useDispatch, useSelector } from 'react-redux'
import { currencyValuesListSelector } from '~/logic/currencyValues/store/selectors'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'

const styles = () => ({
  dropdownContainer: {

  },
})

const DropdownCurrency = ({
  classes,
}: Props) => {
  const currencyPairList = useSelector(currencyValuesListSelector)
  const dispatch = useDispatch()

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const currencyPairListIterator of currencyPairList) {
      const { currencyName } = currencyPairListIterator
      if (currencyName === newCurrencySelectedName) {
        dispatch(setCurrencySelected(currencyPairListIterator))
        return
      }
    }
  }


  return (
    <FormControl variant="filled" className={classes.dropdownContainer}>

      <Select
        native
        onChange={(event) => onCurrentCurrencyChangedHandler(event.target.value)}
      >
        {currencyPairList.valueSeq().map((dropdownValue) => (
          <option key={dropdownValue.currencyName}>{dropdownValue.currencyName}</option>
        ))}
      </Select>
    </FormControl>
  )
}
export default withStyles(styles)(DropdownCurrency)
