// @flow
import { createStructuredSelector } from 'reselect'
import { safesListSelector } from '~/routes/safeList/store/selectors'
import { providerNameSelector } from '~/wallets/store/selectors/index'

export default createStructuredSelector({
  safes: safesListSelector,
  provider: providerNameSelector,
})
