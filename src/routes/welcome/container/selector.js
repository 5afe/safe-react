//
import { createStructuredSelector } from 'reselect'

import { providerNameSelector } from 'logic/wallets/store/selectors'

export default createStructuredSelector({
  provider: providerNameSelector,
})
