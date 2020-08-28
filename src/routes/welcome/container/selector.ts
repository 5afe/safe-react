import { createStructuredSelector } from 'reselect'

import { providerNameSelector } from 'src/logic/wallets/store/selectors'

export default createStructuredSelector({
  provider: providerNameSelector,
})
