// @flow
import { createStructuredSelector } from 'reselect'

import {
  availableSelector,
  loadedSelector,
  networkSelector,
  providerNameSelector,
  userAccountSelector,
} from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  provider: string,
  userAddress: string,
  network: string,
  loaded: boolean,
  available: boolean,
}

export default createStructuredSelector<Object, *>({
  provider: providerNameSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  loaded: loadedSelector,
  available: availableSelector,
})
