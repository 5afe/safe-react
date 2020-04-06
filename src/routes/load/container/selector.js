// 
import { createStructuredSelector } from 'reselect'

import { networkSelector, providerNameSelector, userAccountSelector } from '~/logic/wallets/store/selectors'
import { } from '~/store'


const structuredSelector = createStructuredSelector({
  provider: providerNameSelector,
  network: networkSelector,
  userAddress: userAccountSelector,
})

export default structuredSelector
