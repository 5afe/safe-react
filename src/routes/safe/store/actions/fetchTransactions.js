// @flow
import { List, Map } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/model/transaction'
import { makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { loadSafeSubjects } from '~/utils/localStorage/transactions'
import { buildTxServiceUrlFrom, type TxServiceType } from '~/logic/safe/safeTxHistory'
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
    data: `0x${tx.data}`,
    isExecuted: tx.isExecuted,
  })
}

export const loadSafeTransactions = async (safeAddress: string) => {
  const url = buildTxServiceUrlFrom(safeAddress)
  const response = await enhancedFetch(url, 'Error fetching txs information')
  const transactions: TxServiceModel[] = response.results
  const safeSubjects = loadSafeSubjects(safeAddress)
  const txsRecord = transactions.map((tx: TxServiceModel) => buildTransactionFrom(tx, safeSubjects))

  return Map().set(safeAddress, List(txsRecord))
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const transactions: Map<string, List<Transaction>> = await loadSafeTransactions(safeAddress)

  return dispatch(addTransactions(transactions))
}
