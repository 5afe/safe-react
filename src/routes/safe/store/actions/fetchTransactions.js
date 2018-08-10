// @flow
import { List, Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/model/transaction'
import { load, TX_KEY } from '~/utils/localStorage'
import { makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { loadSafeSubjects } from '~/utils/localStorage/transactions'
import { buildTxServiceUrlFrom, type TxServiceType } from '~/wallets/safeTxHistory'
import { enhancedFetch } from '~/utils/fetch'
import addTransactions from './addTransactions'

type ConfirmationServiceModel = {
  owner: string,
  submissionDate: Date,
  type: TxServiceType,
  transactionHash: string,
}

type TxServiceModel = {
  to: string,
  value: number,
  data: string,
  operation: number,
  nonce: number,
  submissionDate: Date,
  executionDate: Date,
  confirmations: ConfirmationServiceModel[],
  isExecuted: boolean,
}

const buildTransactionFrom = (tx: TxServiceModel, safeSubjects: Map<string, string>) => {
  const name = safeSubjects.get(String(tx.nonce)) || 'Unknown'
  const confirmations = List(tx.confirmations.map((conf: ConfirmationServiceModel) =>
    makeConfirmation({
      owner: makeOwner({ address: conf.owner }),
      type: conf.type,
      hash: conf.transactionHash,
    })))

  return makeTransaction({
    name,
    nonce: tx.nonce,
    value: tx.value,
    confirmations,
    destination: tx.to,
    data: tx.data,
    isExecuted: tx.isExecuted,
  })
}

export const loadSafeTransactions = async () => {
  const safes = load(TX_KEY) || {}
  const safeAddresses: string[] = Object.keys(safes)
  const transactions: TxServiceModel[][] = await Promise.all(safeAddresses.map(async (safeAddress: string) => {
    const url = buildTxServiceUrlFrom(safeAddress)

    return enhancedFetch(url, 'Error fetching txs information')
  }))

  return Map().withMutations((map: Map<string, List<Transaction>>) => {
    transactions.map((safeTxs: TxServiceModel[], index) => {
      const safeAddress = safeAddresses[index]
      const safeSubjects = loadSafeSubjects(safeAddress)
      const txsRecord = safeTxs.map((tx: TxServiceModel) => buildTransactionFrom(tx, safeSubjects))

      return map.set(safeAddress, List(txsRecord))
    })
  })
}

export default () => async (dispatch: ReduxDispatch<GlobalState>) => {
  const transactions: Map<string, List<Transaction>> = await loadSafeTransactions()

  return dispatch(addTransactions(transactions))
}
