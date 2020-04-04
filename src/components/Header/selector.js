// 
import { createStructuredSelector } from 'reselect'

import {
  availableSelector,
  loadedSelector,
  networkSelector,
  providerNameSelector,
  userAccountSelector,
} from '~/logic/wallets/store/selectors'


export default createStructuredSelector({
  provider: providerNameSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  loaded: loadedSelector,
  available: availableSelector,
})
