// @flow
import { List } from 'immutable'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { balanceSelector, safeSelector, type RouterProps, type SafeSelectorProps } from '~/routes/safe/store/selectors'
import { providerNameSelector, userAccountSelector } from '~/wallets/store/selectors/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Owner } from '~/routes/safe/store/model/owner'
import { type GlobalState } from '~/store/index'
import { sameAddress } from '~/wallets/ethAddresses'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
  balances: Map<string, Balance>,
  userAddress: string,
}

export const grantedSelector: Selector<GlobalState, RouterProps, boolean> = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: Safe | typeof undefined): boolean => {
    if (!safe) {
      return false
    }

    if (!userAccount) {
      return false
    }

    const owners: List<Owner> = safe.get('owners')
    if (!owners) {
      return false
    }

    return owners.find((owner: Owner) => sameAddress(owner.get('address'), userAccount)) !== undefined
  },
)

export default createStructuredSelector({
  safe: safeSelector,
  provider: providerNameSelector,
  balances: balanceSelector,
  granted: grantedSelector,
  userAddress: userAccountSelector,
})
