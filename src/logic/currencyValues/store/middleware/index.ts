import fetchCurrencyRate from 'src/logic/currencyValues/store/actions/fetchCurrencyRate'
import { currencyValuesSelector } from 'src/logic/currencyValues/store/selectors'
import { SET_CURRENCY_RATE } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENCY_BALANCES } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { CurrencyReducerMap } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { saveCurrencyValues } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'

const watchedActions = [SET_CURRENT_CURRENCY, SET_CURRENCY_RATE, SET_CURRENCY_BALANCES]

const currencyValuesStorageMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const { dispatch, getState } = store
    const state = getState()
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { safeAddress, selectedCurrency } = action.payload
        dispatch(fetchCurrencyRate(safeAddress, selectedCurrency))
        break
      }
      case SET_CURRENCY_RATE:
      case SET_CURRENCY_BALANCES: {
        const currencyValues = currencyValuesSelector(state)

        const currencyValuesWithoutBalances = currencyValues.map((entry: CurrencyReducerMap) => {
          return {
            currencyRate: entry.get('currencyRate'),
            selectedCurrency: entry.get('selectedCurrency'),
          }
        })

        await saveCurrencyValues(currencyValuesWithoutBalances)
        break
      }

      default:
        break
    }
  }

  return handledAction
}

export default currencyValuesStorageMiddleware
