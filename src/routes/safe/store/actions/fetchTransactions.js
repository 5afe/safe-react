// @flow
import { List, Map } from 'immutable'
import axios from 'axios'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/models/owner'
import { makeTransaction, type Transaction } from '~/routes/safe/store/models/transaction'
import { makeConfirmation } from '~/routes/safe/store/models/confirmation'
import { loadSafeSubjects } from '~/utils/storage/transactions'
import { buildTxServiceUrl, type TxServiceType } from '~/logic/safe/transactions/txHistory'
import { getOwners } from '~/logic/safe/utils'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { addTransactions } from './addTransactions'

type ConfirmationServiceModel = {
  owner: string,
  submissionDate: Date,
  confirmationType: string,
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

const buildTransactionFrom = async (safeAddress: string, tx: TxServiceModel, safeSubjects: Map<string, string>) => {
  const name = safeSubjects.get(String(tx.nonce)) || 'Unknown'
  const storedOwners = await getOwners(safeAddress)
  const confirmations = List(
    tx.confirmations.map((conf: ConfirmationServiceModel) => {
      const ownerName = storedOwners.get(conf.owner.toLowerCase()) || 'UNKNOWN'

      return makeConfirmation({
        owner: makeOwner({ address: conf.owner, name: ownerName }),
        type: ((conf.confirmationType.toLowerCase(): any): TxServiceType),
        hash: conf.transactionHash,
      })
    }),
  )

  return makeTransaction({
    name,
    nonce: tx.nonce,
    value: Number(tx.value),
    confirmations,
    recipient: tx.to,
    data: tx.data ? tx.data : EMPTY_DATA,
    isExecuted: tx.isExecuted,
    submissionDate: tx.submissionDate,
    executionDate: tx.executionDate,
  })
}

export const loadSafeTransactions = async (safeAddress: string) => {
  const url = buildTxServiceUrl(safeAddress)
  const response = await axios.get(url)
  const transactions: TxServiceModel[] = response.data.results
  const safeSubjects = loadSafeSubjects(safeAddress)
  const txsRecord = await Promise.all(
    transactions.map((tx: TxServiceModel) => buildTransactionFrom(safeAddress, tx, safeSubjects)),
  )

  return Map().set(safeAddress, List(txsRecord))
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  const transactions: Map<string, List<Transaction>> = await loadSafeTransactions(safeAddress)

  return dispatch(addTransactions(transactions))
}
