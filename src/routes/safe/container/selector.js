// @flow
import { List } from 'immutable'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { safeSelector, type RouterProps, type SafeSelectorProps } from '~/routes/safe/store/selectors'
import { providerNameSelector, userAccountSelector } from '~/logic/wallets/store/selectors'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Owner } from '~/routes/safe/store/model/owner'
import { type GlobalState } from '~/store'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { activeTokensSelector } from '~/routes/tokens/store/selectors'
import { type Token } from '~/routes/tokens/store/model/token'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
  activeTokens: List<Token>,
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
  activeTokens: activeTokensSelector,
  granted: grantedSelector,
  userAddress: userAccountSelector,
})
