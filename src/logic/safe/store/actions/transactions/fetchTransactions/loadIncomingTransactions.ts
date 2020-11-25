import axios from 'axios'
import { List, Map } from 'immutable'

import { TransactionSummary } from 'src/logic/safe/store/models/types/gateway'
import { buildIncomingTxServiceUrl } from 'src/logic/safe/transactions/incomingTxHistory'

export type IncomingTxServiceModel = {
  blockNumber: number
  transactionHash: string
  to: string
  value: number
  tokenAddress: string
  from: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let next, previous
export const loadIncomingTransactions = async (safeAddress: string): Promise<Map<string, List<TransactionSummary>>> => {
  const incomingTxsFromGateway = buildIncomingTxServiceUrl(safeAddress)
  // requests the first 100 incoming txs
  const params = 'page_url=limit%3D100'
  const {
    data: { results, ...pointers },
  } = await axios.get<{ next: string | null; previous: string | null; results: TransactionSummary[] }>(
    incomingTxsFromGateway,
    { params },
  )

  next = pointers.next
  previous = pointers.previous

  return Map({ [safeAddress]: List(results) })
}
