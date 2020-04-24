// @flow
import { List, Map } from 'immutable'
import { batch } from 'react-redux'
import type { Dispatch as ReduxDispatch } from 'redux'

import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { setCurrencyBalances } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencyRate } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import { loadCurrencyValues, saveCurrencyValues } from '~/logic/currencyValues/store/utils/currencyValuesStorage'
import type { GlobalState } from '~/store'

export const fetchCurrencyValues = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const currencyStored = await loadCurrencyValues(safeAddress)
    if (!currencyStored) {
      const currencyValueSelected = ''
      const currencyRate = 1
      const currencyValuesList = List([])
      const currencyValues = Map([[safeAddress, { currencyRate, currencyValueSelected, currencyValuesList }]])
      saveCurrencyValues(currencyValues)
      return batch(() => {
        dispatch(setCurrencyBalances(safeAddress, List([])))
        dispatch(setCurrencySelected(safeAddress, AVAILABLE_CURRENCIES.USD))
        dispatch(setCurrencyRate(safeAddress, 1))
      })
    }

    const { currencyBalances, currencyRate, currencyValueSelected } = currencyStored

    batch(() => {
      dispatch(setCurrencySelected(safeAddress, currencyValueSelected))
      dispatch(setCurrencyBalances(safeAddress, currencyBalances))
      dispatch(setCurrencyRate(safeAddress, currencyRate))
      dispatch(fetchCurrencySelectedValue(safeAddress, currencyValueSelected))
    })
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
