import axios, { AxiosResponse } from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'

/*************/
/*  HISTORY  */
/*************/
const getHistoryTransactionsUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeClientGatewayBaseUrl(address)}/transactions/history/`
}

const historyPointers: { [safeAddress: string]: { next: string | null; previous: string | null } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: string,
): Promise<{ values: HistoryGatewayResponse['results']; next: string | null } | undefined> => {
  // if `historyPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!historyPointers[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const {
      data: { results, ...pointers },
    } = await axios.get<HistoryGatewayResponse, AxiosResponse<HistoryGatewayResponse>>(
      historyPointers[safeAddress].next as string,
    )

    historyPointers[safeAddress] = pointers

    return { values: results, next: historyPointers[safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactions = async (safeAddress: string): Promise<HistoryGatewayResponse['results']> => {
  const historyTransactionsUrl = getHistoryTransactionsUrl(safeAddress)

  try {
    const {
      data: { results, ...pointers },
    } = await axios.get<HistoryGatewayResponse>(historyTransactionsUrl)

    if (!historyPointers[safeAddress]) {
      historyPointers[safeAddress] = pointers
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

/************/
/*  QUEUED  */
/************/
const getQueuedTransactionsUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeClientGatewayBaseUrl(address)}/transactions/queued/`
}

const queuedPointers: { [safeAddress: string]: { next: string | null; previous: string | null } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedQueuedTransactions = async (
  safeAddress: string,
): Promise<{ values: QueuedGatewayResponse['results']; next: string | null } | undefined> => {
  // if `queuedPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `queuedPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!queuedPointers[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const {
      data: { results, ...pointers },
    } = await axios.get<QueuedGatewayResponse, AxiosResponse<QueuedGatewayResponse>>(
      queuedPointers[safeAddress].next as string,
    )

    queuedPointers[safeAddress] = pointers

    return { values: results, next: queuedPointers[safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._603, e.message)
  }
}

export const loadQueuedTransactions = async (safeAddress: string): Promise<QueuedGatewayResponse['results']> => {
  const queuedTransactionsUrl = getQueuedTransactionsUrl(safeAddress)

  try {
    const {
      data: { results, ...pointers },
    } = await axios.get<QueuedGatewayResponse>(queuedTransactionsUrl)

    if (!queuedPointers[safeAddress] || queuedPointers[safeAddress].next === null) {
      queuedPointers[safeAddress] = pointers
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._603, e.message)
  }
}
