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

type ETag = string | null

let previousETag: ETag = null
export const loadModuleTransactions = async (safeAddress: string): Promise<ModuleTxServiceModel[]> => {
  if (!safeAddress) {
    return []
  }

  const { eTag, results }: { eTag: ETag; results: ModuleTxServiceModel[] } = await fetchTransactions(
    TransactionTypes.MODULE,
    safeAddress,
    previousETag,
  )
  previousETag = eTag

  return results
}
