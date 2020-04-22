// @flow
import { batch } from 'react-redux'
import type { Dispatch as ReduxDispatch } from 'redux'

import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { CURRENCY_SELECTED_KEY } from '~/logic/currencyValues/store/actions/saveCurrencySelected'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import type { GlobalState } from '~/store'
import { loadFromStorage } from '~/utils/storage'

export const fetchCurrencyValues = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const currencyStored = await loadFromStorage(CURRENCY_SELECTED_KEY)

    if (!currencyStored) {
      return dispatch(setCurrencySelected(AVAILABLE_CURRENCIES.USD))
    }

    const { currencyValueSelected } = currencyStored

    batch(() => {
      dispatch(setCurrencySelected(currencyValueSelected))
      dispatch(fetchCurrencySelectedValue(currencyValueSelected))
    })
  } catch (err) {
    console.error('Error fetching tokens price list', err)
  }
  return Promise.resolve()
}

export default fetchCurrencyValues
