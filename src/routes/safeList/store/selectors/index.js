// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { type Owner } from '~/routes/safe/store/model/owner'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'

export const safesMapSelector = (state: GlobalState): Map<string, Safe> => state[SAFE_REDUCER_ID]

export const safesListSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): List<Safe> => safes.toList(),
)

// export const safesByOwnerSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
//   userAccountSelector,
//   safesListSelector,
//   (userAddress: string, safes: List<Safe>): List<Safe> => safes.filter(
//     (safe: Safe) => safe.owners.filter((owner: Owner) => sameAddress(owner.get('address'), userAddress)).count() > 0,
//   ),
// )
