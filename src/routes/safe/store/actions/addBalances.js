// @flow
import { Map } from 'immutable'
import { createAction } from 'redux-actions'
import { type Balance } from '~/routes/safe/store/model/balance'

export const ADD_BALANCES = 'ADD_BALANCES'

type BalanceProps = {
  safeAddress: string,
  balances: Map<string, Balance>,
}

const addBalances = createAction(
  ADD_BALANCES,
  (safeAddress: string, balances: Map<string, Balance>): BalanceProps => ({
    safeAddress,
    balances,
  }),
)

export default addBalances
