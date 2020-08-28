import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export default handleActions(
  {
    [SET_CURRENCY_RATE]: (state, action) => {
      const { currencyRate, safeAddress } = action.payload

      return state.setIn([safeAddress, 'currencyRate'], currencyRate)
    },
    [SET_CURRENCY_BALANCES]: (state, action) => {
      const { currencyBalances, safeAddress } = action.payload

      return state.setIn([safeAddress, 'currencyBalances'], currencyBalances)
    },
    [SET_CURRENT_CURRENCY]: (state, action) => {
      const { safeAddress, selectedCurrency } = action.payload

      return state.setIn([safeAddress, 'selectedCurrency'], selectedCurrency)
    },
  },
  Map(),
)
