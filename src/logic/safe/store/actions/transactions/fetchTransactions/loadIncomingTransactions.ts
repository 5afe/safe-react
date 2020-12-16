import axios, { AxiosResponse } from 'axios'
import { List } from 'immutable'

import { TransactionSummary } from 'src/logic/safe/store/models/types/gateway'
import { buildIncomingTxServiceUrl } from 'src/logic/safe/transactions/incomingTxHistory'
import { sameString } from 'src/utils/strings'

export type IncomingTxServiceModel = {
  blockNumber: number
  transactionHash: string
  to: string
  value: number
  tokenAddress: string
  from: string
}

type ClientGatewayResponse = {
  next: string | null
  previous: string | null
  results: TransactionSummary[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let next, previous
export const loadIncomingTransactions = async (safeAddress: string): Promise<List<TransactionSummary>> => {
  const incomingTxsFromGateway = buildIncomingTxServiceUrl(safeAddress)
  // requests the first 100 incoming txs
  const params = {
    page_url: 'limit=100',
  }
  const {
    data: { results, ...pointers },
  } = await axios.get<ClientGatewayResponse, AxiosResponse<ClientGatewayResponse>>(incomingTxsFromGateway, { params })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next = pointers.next
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  previous = pointers.previous

  return List(
    results.filter(({ txInfo }) => {
      // @ts-expect-error .direction doesn't exist on some possible types
      return sameString(txInfo.direction, 'INCOMING')
    }),
  )
}
