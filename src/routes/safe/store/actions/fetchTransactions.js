// @flow
import { List, Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { makeTransaction, type Transaction, type TransactionProps } from '~/routes/safe/store/model/transaction'
import { load, TX_KEY } from '~/utils/localStorage'
import { type Confirmation, type ConfirmationProps, makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { loadSafeSubjects } from '~/utils/localStorage/transactions'
import addTransactions from './addTransactions'

export const loadSafeTransactions = () => {
  const safes = load(TX_KEY) || {}

  return Map().withMutations((map: Map<string, List<Confirmation>>) =>
    Object.keys(safes).map((safe: string) => {
      const safeTxs = safes[safe]
      const safeSubjects = loadSafeSubjects(safe)
      const safeTxsRecord = safeTxs.map((tx: TransactionProps) => {
        const { confirmations } = tx
        const name = safeSubjects.get(String(tx.nonce)) || 'Unknown'
        const txRecord = makeTransaction({
          ...tx,
          name,
          confirmations: List(confirmations.map((conf: ConfirmationProps) =>
            makeConfirmation({ ...conf, owner: makeOwner(conf.owner) }))),
        })

        return txRecord
      })

      return map.set(safe, List(safeTxsRecord))
    }))
}

export default () => async (dispatch: ReduxDispatch<GlobalState>) => {
  const transactions: Map<string, List<Transaction>> = await loadSafeTransactions()

  return dispatch(addTransactions(transactions))
}
