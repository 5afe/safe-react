// @flow
import { createStructuredSelector } from 'reselect'
import { safesListSelector } from '~/routes/safeList/store/selectors'
import { providerNameSelector } from '~/logic/wallets/store/selectors'

export default createStructuredSelector<Object, *>({
  safes: safesListSelector,
  provider: providerNameSelector,
})
