import {
  getTransactionHistory,
  getTransactionQueue,
  TransactionListPage,
  getIncomingTransfers,
  getMultisigTransactions,
  getModuleTransactions,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { FilterForm, FilterType, FILTER_TYPE_FIELD_NAME } from 'src/routes/safe/components/Transactions/TxList/Filter'
import {
  getIncomingFilter,
  getMultisigFilter,
  getModuleFilter,
} from 'src/routes/safe/components/Transactions/TxList/Filter/utils'

/*************/
/*  HISTORY  */
/*************/

export const _getTxHistory = async (
  chainId: string,
  safeAddress: string,
  filter?: FilterForm | Partial<FilterForm>,
  next?: string,
): Promise<TransactionListPage> => {
  let txListPage: TransactionListPage = {
    next: undefined,
    previous: undefined,
    results: [],
  }

  switch (filter?.[FILTER_TYPE_FIELD_NAME]) {
    case FilterType.INCOMING: {
      txListPage = await getIncomingTransfers(chainId, safeAddress, getIncomingFilter(filter), next)
      break
    }
    case FilterType.MULTISIG: {
      txListPage = await getMultisigTransactions(chainId, safeAddress, getMultisigFilter(filter, true), next)
      break
    }
    case FilterType.MODULE: {
      txListPage = await getModuleTransactions(chainId, safeAddress, getModuleFilter(filter), next)
      break
    }
    default: {
      txListPage = await getTransactionHistory(chainId, safeAddress, next)
    }
  }

  return txListPage
}

export const _getHistoryPageUrl = (pageUrl?: string, filter?: FilterForm | Partial<FilterForm>): undefined | string => {
  if (!pageUrl || !filter || Object.keys(filter).length === 0) {
    return pageUrl
  }

  let url: URL

  try {
    url = new URL(pageUrl)
  } catch {
    return pageUrl
  }

  Object.entries(filter)
    .filter(([, value]) => value !== undefined)
    .forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })

  return url.toString()
}

const historyPointers: { [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string } } } = {}

const getHistoryPointer = (
  next?: string,
  previous?: string,
  filter?: FilterForm | Partial<FilterForm>,
): { next?: string; previous?: string } => ({
  next: _getHistoryPageUrl(next, filter),
  previous: _getHistoryPageUrl(previous, filter),
})

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: string,
  filter?: FilterForm | Partial<FilterForm>,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()
  // if `historyPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (!historyPointers[chainId][safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next, previous } = await _getTxHistory(
      chainId,
      checksumAddress(safeAddress),
      filter,
      historyPointers[chainId][safeAddress].next,
    )

    historyPointers[chainId][safeAddress] = getHistoryPointer(next, previous, filter)

    return { values: results, next: historyPointers[chainId][safeAddress].next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactions = async (
  safeAddress: string,
  filter?: FilterForm | Partial<FilterForm>,
): Promise<HistoryGatewayResponse['results']> => {
  const chainId = _getChainId()
  try {
    const { results, next, previous } = await _getTxHistory(chainId, checksumAddress(safeAddress), filter)

    if (!historyPointers[chainId]) {
      historyPointers[chainId] = {}
    }

    historyPointers[chainId][safeAddress] = getHistoryPointer(next, previous, filter)

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
