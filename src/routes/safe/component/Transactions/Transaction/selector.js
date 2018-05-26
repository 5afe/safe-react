// @flow
import { createStructuredSelector } from 'reselect'
import { confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'

export type SelectorProps = {
  confirmed: confirmationsTransactionSelector,
}

export default createStructuredSelector({
  confirmed: confirmationsTransactionSelector,
})
