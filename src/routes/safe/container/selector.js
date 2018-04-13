// @flow
import { createStructuredSelector } from 'reselect'
import { safeSelector, type SafeSelectorProps } from '~/routes/safe/store/selectors'
import { providerNameSelector } from '~/wallets/store/selectors/index'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
}

export default createStructuredSelector({
  safe: safeSelector,
  provider: providerNameSelector,
})
