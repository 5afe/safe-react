// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector, userAccountSelector, networkSelector, availableSelector, loadedSelector } from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  provider: string,
  userAddress: string,
  network: string,
  loaded: boolean,
  available: boolean,
}

export default createStructuredSelector({
  provider: providerNameSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  loaded: loadedSelector,
  available: availableSelector,
})
