// @flow
import { Action, Store } from 'redux'

import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { SET_CURRENCY_BALANCES } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from '~/logic/currencyValues/store/actions/setCurrencySelected'
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
    const currencyValues = currencyValuesSelector(state)
    await saveCurrencyValues(currencyValues)
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { currencyValueSelected, safeAddress } = action.payload
        dispatch(fetchCurrencySelectedValue(safeAddress, currencyValueSelected))
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default currencyValuesStorageMiddleware
