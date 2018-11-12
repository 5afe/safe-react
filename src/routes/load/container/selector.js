// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector, networkSelector } from '~/logic/wallets/store/selectors'

export default createStructuredSelector({
  provider: providerNameSelector,
  network: networkSelector,
})
