// @flow
import { Action, Store } from 'redux'

import fetchCurrencyRate from '~/logic/currencyValues/store/actions/fetchCurrencyRate'
import { SET_CURRENCY_BALANCES } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from '~/logic/currencyValues/store/actions/setSelectedCurrency'
import { currencyValuesSelector } from '~/logic/currencyValues/store/selectors'
import { saveCurrencyValues } from '~/logic/currencyValues/store/utils/currencyValuesStorage'
import type { GlobalState } from '~/routes/safe/store/middleware/safeStorage'

const watchedActions = [SET_CURRENT_CURRENCY, SET_CURRENCY_RATE, SET_CURRENCY_BALANCES]

const currencyValuesStorageMiddleware = (store: Store<GlobalState>) => (next: Function) => async (
  action: Action<*>,
) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const state: GlobalState = store.getState()
    const { dispatch } = store
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { currencyValueSelected, safeAddress } = action.payload
        dispatch(fetchCurrencyRate(safeAddress, currencyValueSelected))
        break
      }
      case SET_CURRENCY_RATE:
      case SET_CURRENCY_BALANCES: {
        const currencyValues = currencyValuesSelector(state)
        await saveCurrencyValues(currencyValues)
        break
      }

      default:
        break
    }
  }

  return handledAction
}

export default currencyValuesStorageMiddleware
