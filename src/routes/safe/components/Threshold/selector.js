// @flow
import { createStructuredSelector } from 'reselect'
import { userAccountSelector } from '~/logic/wallets/store/selectors'

export type SelectorProps = {
  userAddress: typeof userAccountSelector,
}

export default createStructuredSelector<Object, *>({
  userAddress: userAccountSelector,
})
