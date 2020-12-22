import axios, { AxiosResponse } from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Transaction } from 'src/logic/safe/store/models/types/transactions.d'

export type ServiceUriParams = {
  safeAddress: string
  limit: number
  offset: number
  orderBy?: string // todo: maybe this should be key of MultiSigTransaction | keyof EthereumTransaction
  queued?: boolean
  trusted?: boolean
}

type TransactionDTO = {
  count: number
  next?: string
  previous?: string
  results: Transaction[]
}

const getHistoryTransactionsUri = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/transactions/history`
}

const getQueuedTransactionsUri = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/transactions/queued/`
}

const fetchAllTransactions = async (
  urlParams: ServiceUriParams,
): Promise<{ results: Transaction[]; count?: number }> => {
  const { safeAddress, limit, offset, orderBy, queued, trusted } = urlParams
  try {
    const historyUrl = getHistoryTransactionsUri(safeAddress)
    const queuedUrl = getQueuedTransactionsUri(safeAddress)

    const config = {
      params: {
        limit,
        offset,
        orderBy,
        queued,
        trusted,
      },
    }

    const historyTxResponse: AxiosResponse<TransactionDTO> = await axios.get(historyUrl, config)
    const queuedTxResponse: AxiosResponse<TransactionDTO> = await axios.get(queuedUrl, config)

    if (historyTxResponse.data.count > 0 || queuedTxResponse.data.count > 0) {
      return {
        results: [...historyTxResponse.data.results, ...queuedTxResponse.data.results],
        count: historyTxResponse.data.count + queuedTxResponse.data.count,
      }
    }
  } catch (err) {
    if (!(err && err.response && err.response.status === 304)) {
      console.error(`Requests for outgoing transactions for ${safeAddress || 'unknown'} failed with 404`, err)
    } else {
      // NOTE: this is the expected implementation, currently the backend is not returning 304.
      // So I check if the returned etag is the same instead (see above)
    }
  }
  return { results: [] }
}

export const loadAllTransactions = async (
  uriParams: ServiceUriParams,
): Promise<{
  transactions: Transaction[]
  totalTransactionsAmount?: number
}> => {
  const { results, count } = await fetchAllTransactions(uriParams)

  return {
    transactions: results,
    totalTransactionsAmount: count,
  }
}
