import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { saveSelectedCurrency } from 'src/logic/safe/utils/currencyValuesStorage'

const watchedActions = [SET_CURRENT_CURRENCY]

export const currencyValuesStorageMiddleware = () => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { selectedCurrency } = action.payload
        await saveSelectedCurrency(selectedCurrency)
        break
      }

      default:
        break
    }
  }

  return handledAction
}
