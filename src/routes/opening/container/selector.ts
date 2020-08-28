import { createStructuredSelector } from 'reselect'

import { networkSelector } from 'src/logic/wallets/store/selectors'

export default createStructuredSelector({
  network: networkSelector,
})
