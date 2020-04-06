// 
import { Map } from 'immutable'
import { handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from '../actions/setCurrencyBalances'

import { SET_CURRENT_CURRENCY } from 'src/logic/currencyValues/store/actions/setCurrencySelected'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export default handleActions(
  {
    [SET_CURRENCY_BALANCES]: (state, action) => {
      const { currencyBalances } = action.payload

      const newState = state.set('currencyBalances', currencyBalances)

      return newState
    },
    [SET_CURRENT_CURRENCY]: (state, action) => {
      const { currencyValueSelected } = action.payload

      const newState = state.set('currencyValueSelected', currencyValueSelected)

      return newState
    },
  },
  Map(),
)
