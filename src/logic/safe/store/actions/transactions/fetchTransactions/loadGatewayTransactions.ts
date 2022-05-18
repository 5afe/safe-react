import { getTransactionHistory, getTransactionQueue } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'

/*************/
/*  HISTORY  */
/*************/
const historyPointers: { [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string } } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: string,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()
  // if `historyPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!historyPointers[chainId][safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next, previous } = await getTransactionHistory(
      chainId,
      checksumAddress(safeAddress),
      historyPointers[chainId][safeAddress].next,
    )

    historyPointers[chainId][safeAddress] = { next, previous }

    return { values: results, next: historyPointers[chainId][safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactions = async (safeAddress: string): Promise<HistoryGatewayResponse['results']> => {
  const chainId = _getChainId()
  try {
    const { results, next, previous } = await getTransactionHistory(chainId, checksumAddress(safeAddress))

    if (!historyPointers[chainId]) {
      historyPointers[chainId] = {}
    }

    if (!historyPointers[chainId][safeAddress]) {
      historyPointers[chainId][safeAddress] = { next, previous }
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

/************/
/*  QUEUED  */
/************/
const queuedPointers: { [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string } } } = {}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedQueuedTransactions = async (
  safeAddress: string,
): Promise<{ values: QueuedGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()
  // if `queuedPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `queuedPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!queuedPointers[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next, previous } = await getTransactionQueue(
      chainId,
      checksumAddress(safeAddress),
      queuedPointers[chainId][safeAddress].next,
    )

    queuedPointers[chainId][safeAddress] = { next, previous }

    return { values: results, next: queuedPointers[chainId][safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._603, e.message)
  }
}

export const loadQueuedTransactions = async (safeAddress: string): Promise<QueuedGatewayResponse['results']> => {
  const chainId = _getChainId()
  try {
    const { results, next, previous } = await getTransactionQueue(chainId, checksumAddress(safeAddress))

    if (!queuedPointers[chainId]) {
      queuedPointers[chainId] = {}
    }

    if (!queuedPointers[chainId][safeAddress] || queuedPointers[chainId][safeAddress].next === null) {
      queuedPointers[chainId][safeAddress] = { next, previous }
    }

    return results
  } catch (e) {
    throw new CodedException(Errors._603, e.message)
  }
}
