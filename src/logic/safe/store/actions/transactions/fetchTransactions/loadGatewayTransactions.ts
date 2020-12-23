import axios, { AxiosResponse } from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway'
import { checksumAddress } from 'src/utils/checksumAddress'

const getHistoryTransactionsUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeClientGatewayBaseUrl(address)}/transactions/history/`
}

const historyPointers: { next: string | null; previous: string | null } = {
  next: null,
  previous: null,
}

export const loadHistoryTransactions = async (safeAddress: string): Promise<HistoryGatewayResponse['results']> => {
  const historyTransactionsUrl = getHistoryTransactionsUrl(safeAddress)
  // requests the first 100 incoming txs
  const params = {
    page_url: 'limit=100',
  }
  const {
    data: { results, ...pointers },
  } = await axios.get<HistoryGatewayResponse, AxiosResponse<HistoryGatewayResponse>>(historyTransactionsUrl, { params })

  historyPointers.next = pointers.next
  historyPointers.previous = pointers.previous

  return results
}

const getQueuedTransactionsUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeClientGatewayBaseUrl(address)}/transactions/queued/`
}

const queuedPointers: { next: string | null; previous: string | null } = {
  next: null,
  previous: null,
}

export const loadQueuedTransactions = async (safeAddress: string): Promise<QueuedGatewayResponse['results']> => {
  const queuedTransactionsUrl = getQueuedTransactionsUrl(safeAddress)
  // requests the first 100 incoming txs
  const params = {
    page_url: 'limit=100',
  }
  const {
    data: { results, ...pointers },
  } = await axios.get<QueuedGatewayResponse, AxiosResponse<QueuedGatewayResponse>>(queuedTransactionsUrl, { params })

  queuedPointers.next = pointers.next
  queuedPointers.previous = pointers.previous

  return results
}
