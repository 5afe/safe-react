// @flow
import { Map } from 'immutable'
import { type Match } from 'react-router-dom'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { SAFE_PARAM_ADDRESS } from '~/routes'
import { type Safe } from '~/routes/safe/store/model/safe'
import { safesMapSelector } from '~/routes/safeList/store/selectors'

type RouterProps = {
  match: Match,
}

const safeAddessSelector = (state: GlobalState, props: RouterProps) => props.match.params[SAFE_PARAM_ADDRESS] || ''

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

export default createStructuredSelector({
  safe: safeSelector,
})
