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
import { ChainId } from 'src/config/chain.d'
import { operations } from '@gnosis.pm/safe-react-gateway-sdk/dist/types/api'

/*************/
/*  HISTORY  */
/*************/
const historyPointers: {
  [chainId: string]: {
    [safeAddress: string]: {
      next?: string
      previous?: string
    }
  }
} = {}

const getHistoryTxListPage = async (
  chainId: ChainId,
  safeAddress: string,
  filter?: FilterForm | Partial<FilterForm>,
): Promise<TransactionListPage> => {
  let txListPage: TransactionListPage = {
    next: undefined,
    previous: undefined,
    results: [],
  }

  const { next } = historyPointers[chainId]?.[safeAddress] || {}

  let query:
    | operations['incoming_transfers' | 'incoming_transfers' | 'module_transactions']['parameters']['query']
    | undefined

  switch (filter?.[FILTER_TYPE_FIELD_NAME]) {
    case FilterType.INCOMING: {
      query = filter ? getIncomingFilter(filter) : undefined
      txListPage = await getIncomingTransfers(chainId, safeAddress, query, next)
      break
    }
    case FilterType.MULTISIG: {
      query = filter ? getMultisigFilter(filter, true) : undefined
      txListPage = await getMultisigTransactions(chainId, safeAddress, query, next)
      break
    }
    case FilterType.MODULE: {
      query = filter ? getModuleFilter(filter) : undefined
      txListPage = await getModuleTransactions(chainId, safeAddress, query, next)
      break
    }
    default: {
      txListPage = await getTransactionHistory(chainId, safeAddress, next)
    }
  }

  const getPageUrl = (pageUrl?: string): string | undefined => {
    if (!pageUrl || !query) {
      return pageUrl
    }

    let url: URL

    try {
      url = new URL(pageUrl)
    } catch {
      return pageUrl
    }

    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })

    return url.toString()
  }

  historyPointers[chainId][safeAddress].next = getPageUrl(txListPage?.next)
  historyPointers[chainId][safeAddress].previous = getPageUrl(txListPage?.previous)

  return txListPage
}

/**
 * Fetch next page if there is a next pointer for the safeAddress.
 * If the fetch was success, updates the pointers.
 * @param {string} safeAddress
 */
export const loadPagedHistoryTransactions = async (
  safeAddress: string,
): Promise<{ values: HistoryGatewayResponse['results']; next?: string } | undefined> => {
  const chainId = _getChainId()

  if (!historyPointers[chainId]?.[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results, next } = await getHistoryTxListPage(chainId, safeAddress)

    return { values: results, next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactions = async (
  safeAddress: string,
  filter?: FilterForm | Partial<FilterForm>,
): Promise<HistoryGatewayResponse['results']> => {
  const chainId = _getChainId()

  if (!historyPointers[chainId]) {
    historyPointers[chainId] = {}
  }

  if (!historyPointers[chainId][safeAddress] || filter) {
    historyPointers[chainId][safeAddress] = {
      next: undefined,
      previous: undefined,
    }
  }

  try {
    const { results } = await getHistoryTxListPage(chainId, safeAddress, filter)

    return results
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTip = async (safeAddress: string): Promise<HistoryGatewayResponse['results']> => {
  const chainId = _getChainId()

  try {
    const { results, next, previous } = await getTransactionHistory(chainId, safeAddress)

    // If it's the very first request to fetch the history for this Safe
    if (!historyPointers[chainId]?.[safeAddress]) {
      historyPointers[chainId] = historyPointers[chainId] || {}
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
