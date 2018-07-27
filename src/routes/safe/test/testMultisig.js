// @flow
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { type GlobalState } from '~/store/index'

export const getTransactionFromReduxStore = (store: Store<GlobalState>, address: string, index: number = 0) => {
  const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })

  return transactions.get(index)
}
