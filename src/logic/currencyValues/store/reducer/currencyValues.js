// @flow
import { Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import type { State } from '~/logic/tokens/store/reducer/tokens'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export default handleActions<State, *>(
  {
    [SET_CURRENCY_RATE]: (state: State, action: ActionType<Function>): State => {
      const { currencyRate } = action.payload

      return state.set('currencyRate', currencyRate)
    },
    [SET_CURRENCY_BALANCES]: (state: State, action: ActionType<Function>): State => {
      const { currencyBalances } = action.payload

      return state.set('currencyBalances', currencyBalances)
    },
    [SET_CURRENT_CURRENCY]: (state: State, action: ActionType<Function>): State => {
      const { currencyValueSelected } = action.payload

      return state.set('currencyValueSelected', currencyValueSelected)
    },
  },
  Map(),
)
