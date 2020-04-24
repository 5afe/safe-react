// @flow
import { batch } from 'react-redux'
import type { Dispatch as ReduxDispatch } from 'redux'

import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { CURRENCY_SELECTED_KEY } from '~/logic/currencyValues/store/actions/saveCurrencySelected'
import { setCurrencyRate } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import type { GlobalState } from '~/store'
import { loadFromStorage } from '~/utils/storage'

export const fetchCurrencyValues = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const currencyStored = await loadFromStorage(CURRENCY_SELECTED_KEY)

    if (!currencyStored) {
      return batch(() => {
        dispatch(setCurrencySelected(AVAILABLE_CURRENCIES.USD))
        dispatch(setCurrencyRate(1))
      })
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
