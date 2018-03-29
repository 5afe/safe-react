// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector, userAccountSelector } from '~/wallets/store/selectors/index'

export default createStructuredSelector({
  provider: providerNameSelector,
  userAccount: userAccountSelector,
})
