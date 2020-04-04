// 
import { List } from 'immutable'
import { Dispatch as ReduxDispatch } from 'redux'

import fetchCurrenciesRates from 'logic/currencyValues/api/fetchCurrenciesRates'
import { setCurrencyBalances } from 'logic/currencyValues/store/actions/setCurrencyBalances'
import { AVAILABLE_CURRENCIES } from 'logic/currencyValues/store/model/currencyValues'
import { currencyValuesListSelector } from 'logic/currencyValues/store/selectors'

// eslint-disable-next-line max-len
const fetchCurrencySelectedValue = (currencyValueSelected) => async (
  dispatch,
  getState,
) => {
  const state = getState()
  const currencyBalancesList = currencyValuesListSelector(state)
  const selectedCurrencyRateInBaseCurrency = await fetchCurrenciesRates(AVAILABLE_CURRENCIES.USD, currencyValueSelected)

  const newList = []
  for (const currencyValue of currencyBalancesList) {
    const { balanceInBaseCurrency } = currencyValue

    const balanceInSelectedCurrency = balanceInBaseCurrency * selectedCurrencyRateInBaseCurrency

    const updatedValue = currencyValue.merge({
      currencyName: currencyValueSelected,
      balanceInSelectedCurrency,
    })

    newList.push(updatedValue)
  }

  dispatch(setCurrencyBalances(List(newList)))
}

export default fetchCurrencySelectedValue
