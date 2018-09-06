// @flow
import { createStructuredSelector } from 'reselect'
import { safesByOwnerSelector } from '~/routes/safeList/store/selectors'
import { providerNameSelector } from '~/logic/wallets/store/selectors'

export default createStructuredSelector({
  safes: safesByOwnerSelector,
  provider: providerNameSelector,
})
