// @flow
import { List } from 'immutable'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { balanceSelector, safeSelector, type RouterProps, type SafeSelectorProps } from '~/routes/safe/store/selectors'
import { providerNameSelector, userAccountSelector } from '~/wallets/store/selectors/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Owner } from '~/routes/safe/store/model/owner'
import { type GlobalState } from '~/store/index'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
  balance: string,
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

    return owners.find((owner: Owner) => owner.get('address').toLocaleLowerCase() === userAccount.toLocaleLowerCase()) !== undefined
  },
)

export default createStructuredSelector({
  safe: safeSelector,
  provider: providerNameSelector,
  balance: balanceSelector,
  granted: grantedSelector,
})
