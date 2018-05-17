// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import { userAccountSelector } from '~/wallets/store/selectors/index'

export const safesMapSelector = (state: GlobalState): Map<string, Safe> => state.safes
const safesListSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): List<Safe> => safes.toList(),
)

export const safesByOwnerSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
  userAccountSelector,
  safesListSelector,
  (userAddress: string, safes: List<Safe>): List<Safe> =>
    safes.filter((safe: Safe) =>
      safe.owners.filter(owner => owner.get('address') === userAddress).count() > 0),
)
