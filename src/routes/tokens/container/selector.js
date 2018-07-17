// @flow
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { tokenListSelector, tokenAddressesSelector } from '~/routes/tokens/store/selectors'
import { type Safe } from '~/routes/safe/store/model/safe'
import { safeSelector, safeParamAddressSelector } from '~/routes/safe/store/selectors'
import { type Token } from '~/routes/tokens/store/model/token'

export type SelectorProps = {
  tokens: List<Token>,
  addresses: List<string>,
  safe: Safe,
  safeAddress: string,
}

export default createStructuredSelector({
  safe: safeSelector,
  safeAddress: safeParamAddressSelector,
  tokens: tokenListSelector,
  addresses: tokenAddressesSelector,
})
