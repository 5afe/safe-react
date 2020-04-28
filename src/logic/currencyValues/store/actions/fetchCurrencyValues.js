// @flow
import { List } from 'immutable'
import { batch } from 'react-redux'
import type { Dispatch as ReduxDispatch } from 'redux'

import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { setCurrencyBalances } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencyRate } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import { loadCurrencyValues } from '~/logic/currencyValues/store/utils/currencyValuesStorage'
import type { GlobalState } from '~/store'

export const fetchCurrencyValues = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const currenciesStored = await loadCurrencyValues()
    const currencyStored = currenciesStored[safeAddress]
    if (!currencyStored) {
      return batch(() => {
        dispatch(setCurrencyBalances(safeAddress, List([])))
        dispatch(setCurrencySelected(safeAddress, AVAILABLE_CURRENCIES.USD))
        dispatch(setCurrencyRate(safeAddress, 1))
      })
    }
    // Loads the stored state on redux
    Object.entries(currenciesStored).forEach((kv) => {
      const safeAdd = kv[0]
      const value = kv[1]
      const { currencyBalances, currencyRate, currencyValueSelected } = value
      batch(() => {
        dispatch(setCurrencySelected(safeAdd, currencyValueSelected))
        dispatch(setCurrencyBalances(safeAdd, currencyBalances))
        dispatch(setCurrencyRate(safeAdd, currencyRate))
        dispatch(fetchCurrencySelectedValue(safeAdd, currencyValueSelected))
      })
    })
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
