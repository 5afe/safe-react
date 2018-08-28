// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector, userAccountSelector, networkSelector, connectedSelector } from '~/logic/wallets/store/selectors'

export default createStructuredSelector({
  provider: providerNameSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  connected: connectedSelector,
})
