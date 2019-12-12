// @flow
import type { AnyAction } from 'redux'
import { SET_CURRENT_CURRENCY } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { saveToStorage } from '~/utils/storage'

const watchedActions = [
  SET_CURRENT_CURRENCY,
]

export const CURRENCY_SELECTED_KEY = 'CURRENCY_SELECTED_KEY'


const currencyMiddleware = () => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const currencySelected = action.payload
        await saveToStorage(CURRENCY_SELECTED_KEY, currencySelected)
        break
      }
      default:
        break
    }
  }

  return handledAction
}

export default currencyMiddleware
