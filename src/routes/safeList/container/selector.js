// @flow
import { createStructuredSelector } from 'reselect'
import { safesByOwnerSelector } from '~/routes/safeList/store/selectors'
import { providerNameSelector } from '~/wallets/store/selectors/index'

export default createStructuredSelector({
  safes: safesByOwnerSelector,
  provider: providerNameSelector,
})
