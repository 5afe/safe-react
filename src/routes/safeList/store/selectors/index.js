// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import { userAccountSelector } from '~/wallets/store/selectors/index'
import { type Owner } from '~/routes/safe/store/model/owner'

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
      safe.owners.filter((owner: Owner) => {
        const ownerLower = owner.get('address').toLowerCase()
        const userLower = userAddress.toLowerCase()

        return ownerLower === userLower
      }).count() > 0),
)
