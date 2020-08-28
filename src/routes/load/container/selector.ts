import { createStructuredSelector } from 'reselect'

import { networkSelector, providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'

const structuredSelector = createStructuredSelector({
  provider: providerNameSelector,
  network: networkSelector,
  userAddress: userAccountSelector,
})

export default structuredSelector
