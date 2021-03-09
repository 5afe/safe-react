import { SET_CURRENT_CURRENCY } from 'src/logic/safe/store/actions/setSelectedCurrency'
import { saveSelectedCurrency } from 'src/logic/safe/utils/currencyValuesStorage'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'

const watchedActions = [SET_CURRENT_CURRENCY]

export const currencyValuesStorageMiddleware = ({ dispatch }) => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { selectedCurrency, safeAddress } = action.payload

        saveSelectedCurrency(selectedCurrency)
        dispatch(fetchSafeTokens(safeAddress, selectedCurrency))
        break
      }

      default:
        break
    }
  }

  return handledAction
}
