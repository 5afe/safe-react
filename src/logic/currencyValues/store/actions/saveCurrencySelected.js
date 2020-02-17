// @flow

import { Dispatch as ReduxDispatch } from 'redux'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import type { GlobalState } from '~/store'

import { saveToStorage } from '~/utils/storage'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'

export const CURRENCY_SELECTED_KEY = 'CURRENCY_SELECTED_KEY'

const saveCurrencySelected = (currencySelected: AVAILABLE_CURRENCIES) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  await saveToStorage(CURRENCY_SELECTED_KEY, { currencyValueSelected: currencySelected })
  dispatch(setCurrencySelected(currencySelected))
}

export default saveCurrencySelected
