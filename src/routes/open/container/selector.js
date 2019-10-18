// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector, userAccountSelector, networkSelector } from '~/logic/wallets/store/selectors'

export default createStructuredSelector<Object, *>({
  provider: providerNameSelector,
  network: networkSelector,
  userAccount: userAccountSelector,
})
