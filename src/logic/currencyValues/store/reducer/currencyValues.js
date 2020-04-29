// @flow
import { Map } from 'immutable'
import { type ActionType, handleActions } from 'redux-actions'

import { SET_CURRENCY_BALANCES } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { SET_CURRENCY_RATE } from '~/logic/currencyValues/store/actions/setCurrencyRate'
import { SET_CURRENT_CURRENCY } from '~/logic/currencyValues/store/actions/setSelectedCurrency'
import type { State } from '~/logic/tokens/store/reducer/tokens'

export const CURRENCY_VALUES_KEY = 'currencyValues'

export default handleActions<State, *>(
  {
    [SET_CURRENCY_RATE]: (state: State, action: ActionType<Function>): State => {
      const { currencyRate, safeAddress } = action.payload

      return state.setIn(['currencyValues', safeAddress, 'currencyRate'], currencyRate)
    },
    [SET_CURRENCY_BALANCES]: (state: State, action: ActionType<Function>): State => {
      const { currencyBalances, safeAddress } = action.payload

      return state.setIn(['currencyValues', safeAddress, 'currencyBalances'], currencyBalances)
    },
    [SET_CURRENT_CURRENCY]: (state: State, action: ActionType<Function>): State => {
      const { currencyValueSelected, safeAddress } = action.payload

      return state.setIn(['currencyValues', safeAddress, 'currencyValueSelected'], currencyValueSelected)
    },
  },
  Map(),
)
