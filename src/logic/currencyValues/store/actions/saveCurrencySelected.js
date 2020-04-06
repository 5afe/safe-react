// 

import { Dispatch as ReduxDispatch } from 'redux'

import { setCurrencySelected } from 'src/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { saveToStorage } from 'src/utils/storage'

export const CURRENCY_SELECTED_KEY = 'CURRENCY_SELECTED_KEY'

const saveCurrencySelected = (currencySelected) => async (
  dispatch,
) => {
  await saveToStorage(CURRENCY_SELECTED_KEY, { currencyValueSelected: currencySelected })
  dispatch(setCurrencySelected(currencySelected))
}

export default saveCurrencySelected
