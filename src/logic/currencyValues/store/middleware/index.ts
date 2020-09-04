import fetchCurrencyRate from 'src/logic/currencyValues/store/actions/fetchCurrencyRate'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'

const watchedActions = [SET_CURRENT_CURRENCY]

const currencyValuesStorageMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const { dispatch } = store
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { safeAddress, selectedCurrency } = action.payload
        dispatch(fetchCurrencyRate(safeAddress, selectedCurrency))
        break
      }

      default:
        break
    }
  }

  return handledAction
}

export default currencyValuesStorageMiddleware
