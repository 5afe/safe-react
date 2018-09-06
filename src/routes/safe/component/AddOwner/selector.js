// @flow
import { createStructuredSelector } from 'reselect'
import { userAccountSelector } from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  userAddress: userAccountSelector,
}

export default createStructuredSelector({
  userAddress: userAccountSelector,
})
