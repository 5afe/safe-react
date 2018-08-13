// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector, userAccountSelector } from '~/logic/wallets/store/selectors'

export default createStructuredSelector({
  provider: providerNameSelector,
  userAccount: userAccountSelector,
})
