// @flow
import { type Selector, createStructuredSelector } from 'reselect'

import { networkSelector, providerNameSelector, userAccountSelector } from '~/logic/wallets/store/selectors'
import { type GlobalState } from '~/store'

export type SelectorProps = {
  provider: string,
  network: string,
  userAddress: string,
}

const structuredSelector: Selector<GlobalState, any, any> = createStructuredSelector({
  provider: providerNameSelector,
  network: networkSelector,
  userAddress: userAccountSelector,
})

export default structuredSelector
