import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { saveSelectedCurrency } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'

const watchedActions = [SET_CURRENT_CURRENCY]

const currencyValuesStorageMiddleware = () => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { selectedCurrency } = action.payload

        saveSelectedCurrency(selectedCurrency)
        break
      }

      default:
        break
    }
  }

  return handledAction
}

export default currencyValuesStorageMiddleware
