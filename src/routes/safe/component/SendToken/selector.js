// @flow
import { createStructuredSelector } from 'reselect'
import { userAccountSelector } from '~/wallets/store/selectors/index'

export type SelectorProps = {
  userAddress: userAccountSelector,
}

export default createStructuredSelector({
  userAddress: userAccountSelector,
})
