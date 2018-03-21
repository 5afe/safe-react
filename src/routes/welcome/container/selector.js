// @flow
import { createStructuredSelector } from 'reselect'
import { providerNameSelector } from '~/wallets/store/selectors/index'

export default createStructuredSelector({
  provider: providerNameSelector,
})
