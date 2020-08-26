import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { store } from 'src/store'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions/fetchTransactions'
import { TransactionTypes } from 'src/logic/safe/store/models/types/transaction'
import { DataDecoded, Operation } from 'src/logic/safe/store/models/types/transactions.d'

export type ModuleTxServiceModel = {
  created: string
  executionDate: string
  blockNumber: number
  transactionHash: string
  safe: string
  module: string
  to: string
  value: string
  data: string
  operation: Operation
  dataDecoded: DataDecoded
}

let previousETag = null
export const loadModuleTransactions = async (safeAddress: string): Promise<ModuleTxServiceModel[]> => {
  const defaultResponse = []
  const state = store.getState()

  if (!safeAddress) {
    return defaultResponse
  }

  const safe = state[SAFE_REDUCER_ID].getIn(['safes', safeAddress])

  if (!safe) {
    return defaultResponse
  }

  const { eTag, results }: { eTag: string | null; results: ModuleTxServiceModel[] } = await fetchTransactions(
    TransactionTypes.MODULE,
    safeAddress,
    previousETag,
  )
  previousETag = eTag

  return results
}
