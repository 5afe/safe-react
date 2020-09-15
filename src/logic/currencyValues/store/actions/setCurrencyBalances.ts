import { createAction } from 'redux-actions'
import { BalanceCurrencyList } from 'src/logic/currencyValues/store/model/currencyValues'

export const SET_CURRENCY_BALANCES = 'SET_CURRENCY_BALANCES'

export const setCurrencyBalances = createAction(
  SET_CURRENCY_BALANCES,
  (safeAddress: string, currencyBalances: BalanceCurrencyList) => ({
    safeAddress,
    currencyBalances,
  }),
)
