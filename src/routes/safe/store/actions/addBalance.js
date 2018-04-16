// @flow
import { createAction } from 'redux-actions'

export const ADD_BALANCE = 'ADD_BALANCE'

type BalanceProps = {
  safeAddress: string,
  funds: string,
}

const addBalance = createAction(
  ADD_BALANCE,
  (safeAddress: string, funds: string): BalanceProps => ({
    safeAddress,
    funds,
  }),
)

export default addBalance
