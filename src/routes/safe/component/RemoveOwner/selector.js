// @flow
import { createStructuredSelector } from 'reselect'
import { userAccountSelector } from '~/wallets/store/selectors/index'

export type SelectorProps = {
  executor: userAccountSelector,
}

export default createStructuredSelector({
  executor: userAccountSelector,
})
