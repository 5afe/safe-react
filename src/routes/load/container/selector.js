// @flow
import { createStructuredSelector, type Selector } from 'reselect'
import { providerNameSelector, networkSelector, userAccountSelector } from '~/logic/wallets/store/selectors'
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

