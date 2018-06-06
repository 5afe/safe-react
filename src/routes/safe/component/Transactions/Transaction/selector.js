// @flow
import { createStructuredSelector } from 'reselect'
import { confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'
import { userAccountSelector } from '~/wallets/store/selectors/index'

export type SelectorProps = {
  confirmed: confirmationsTransactionSelector,
  userAddress: userAccountSelector,
}

export default createStructuredSelector({
  confirmed: confirmationsTransactionSelector,
  userAddress: userAccountSelector,
})
