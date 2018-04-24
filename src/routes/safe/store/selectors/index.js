// @flow
import { Map } from 'immutable'
import { type Match } from 'react-router-dom'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { SAFE_PARAM_ADDRESS } from '~/routes/routes'
import { type Safe } from '~/routes/safe/store/model/safe'
import { safesMapSelector } from '~/routes/safeList/store/selectors'
import { BALANCE_REDUCER_ID } from '~/routes/safe/store/reducer/balances'

type RouterProps = {
  match: Match,
}

const safeAddessSelector = (state: GlobalState, props: RouterProps) => props.match.params[SAFE_PARAM_ADDRESS] || ''

const balancesSelector = (state: GlobalState) => state[BALANCE_REDUCER_ID]

export type SafeSelectorProps = Safe | typeof undefined

export const safeSelector: Selector<GlobalState, RouterProps, SafeSelectorProps> = createSelector(
  safesMapSelector,
  safeAddessSelector,
  (safes: Map<string, Safe>, address: string) => {
    if (!address) {
      return undefined
    }

    return safes.get(address)
  },
)

export const balanceSelector: Selector<GlobalState, RouterProps, string> = createSelector(
  balancesSelector,
  safeAddessSelector,
  (balances: Map<string, string>, address: string) => {
    if (!address) {
      return '0'
    }

    return balances.get(address) || '0'
  },
)

export default createStructuredSelector({
  safe: safeSelector,
})
