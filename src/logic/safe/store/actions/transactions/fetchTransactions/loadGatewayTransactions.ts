import { getTransactionHistory, getTransactionQueue } from '@gnosis.pm/safe-react-gateway-sdk'
import { getClientGatewayUrl, getNetworkId } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'

/*************/
/*  HISTORY  */
/*************/
const historyPointers: { [safeAddress: string]: { next?: string; previous?: string } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: string,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  // if `historyPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!historyPointers[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next, previous } = await getTransactionHistory(
      getClientGatewayUrl(),
      getNetworkId().toString(),
      checksumAddress(safeAddress),
      historyPointers[safeAddress].next,
    )

    historyPointers[safeAddress] = { next, previous }

    return { values: results, next: historyPointers[safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactions = async (safeAddress: string): Promise<HistoryGatewayResponse['results']> => {
  try {
    const { results, next, previous } = await getTransactionHistory(
      getClientGatewayUrl(),
      getNetworkId().toString(),
      checksumAddress(safeAddress),
    )

    if (!historyPointers[safeAddress]) {
      historyPointers[safeAddress] = { next, previous }
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

/************/
/*  QUEUED  */
/************/
const queuedPointers: { [safeAddress: string]: { next?: string; previous?: string } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedQueuedTransactions = async (
  safeAddress: string,
): Promise<{ values: QueuedGatewayResponse['results']; next?: string } | undefined> => {
  // if `queuedPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `queuedPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!queuedPointers[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next, previous } = await getTransactionQueue(
      getClientGatewayUrl(),
      getNetworkId().toString(),
      checksumAddress(safeAddress),
      queuedPointers[safeAddress].next,
    )

    queuedPointers[safeAddress] = { next, previous }

    return { values: results, next: queuedPointers[safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._603, e.message)
  }
}

export const loadQueuedTransactions = async (safeAddress: string): Promise<QueuedGatewayResponse['results']> => {
  try {
    const { results, next, previous } = await getTransactionQueue(
      getClientGatewayUrl(),
      getNetworkId().toString(),
      checksumAddress(safeAddress),
    )

    if (!queuedPointers[safeAddress] || queuedPointers[safeAddress].next === null) {
      queuedPointers[safeAddress] = { next, previous }
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._603, e.message)
  }
}
