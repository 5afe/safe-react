import fetchCurrencyRate from 'src/logic/currencyValues/store/actions/fetchCurrencyRate'
import { SET_CURRENCY_BALANCES } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { currencyValuesSelector } from 'src/logic/currencyValues/store/selectors'
import { saveCurrencyValues } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'
import { AVAILABLE_CURRENCIES, CurrencyRateValue } from '../model/currencyValues'
import { Map } from 'immutable'

const watchedActions = [SET_CURRENT_CURRENCY, SET_CURRENCY_RATE, SET_CURRENCY_BALANCES]

const currencyValuesStorageMiddleware = (store) => (next) => async (action) => {
  const handledAction = next(action)
  if (watchedActions.includes(action.type)) {
    const state = store.getState()
    const { dispatch } = store
    switch (action.type) {
      case SET_CURRENT_CURRENCY: {
        const { safeAddress, selectedCurrency } = action.payload
        dispatch(fetchCurrencyRate(safeAddress, selectedCurrency))
        break
      }
      case SET_CURRENCY_RATE:
      case SET_CURRENCY_BALANCES: {
        const currencyValues = currencyValuesSelector(state)

        const currencyValuesWithoutBalances: Map<string, CurrencyRateValue> = currencyValues.map((currencyValue) => {
          const currencyRate: number = currencyValue.get('currencyRate')
          const selectedCurrency: AVAILABLE_CURRENCIES = currencyValue.get('selectedCurrency')
          return {
            currencyRate,
            selectedCurrency,
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
