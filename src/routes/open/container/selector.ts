//
import { createStructuredSelector } from 'reselect'

import { networkSelector, providerNameSelector, userAccountSelector } from 'logic/wallets/store/selectors'

export default createStructuredSelector({
  provider: providerNameSelector,
  network: networkSelector,
  userAccount: userAccountSelector,
})
