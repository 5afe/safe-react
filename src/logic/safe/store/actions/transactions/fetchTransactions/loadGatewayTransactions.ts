import { getTransactionHistory, getTransactionQueue, TransactionListPage } from '@gnosis.pm/safe-react-gateway-sdk'
import { getIncomingTransfers, getMultisigTransactions, getModuleTransactions } from '@@test/dist'
import { parse, stringify } from 'query-string'
import { _getChainId } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { history } from 'src/routes/routes'
import { FilterType } from 'src/routes/safe/components/Transactions/TxList/Filter'

/*************/
/*  HISTORY  */
/*************/
const historyPointers: {
  [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string; filterType?: FilterType } }
} = {}

export const loadHistory = async (safeAddress: string): Promise<TransactionListPage> => {
  const chainId = _getChainId()
  const checksummedAddress = checksumAddress(safeAddress)

  const { type, ...query } = parse(history.location.search)
  const filterType = typeof type === 'string' ? (type as FilterType) : undefined

  const newFilter = filterType !== historyPointers?.[chainId]?.[safeAddress]?.filterType

  if (!historyPointers[chainId] || newFilter) {
    historyPointers[chainId] = {}
  }

  const historyPointerNext = historyPointers[chainId]?.[safeAddress]?.next

  let txListPage: TransactionListPage = {
    next: undefined,
    previous: undefined,
    results: [],
  }

  try {
    switch (filterType) {
      case FilterType.INCOMING: {
        txListPage = await getIncomingTransfers(chainId, checksummedAddress, query, historyPointerNext)
        break
      }
      case FilterType.MULTISIG: {
        txListPage = await getMultisigTransactions(chainId, checksummedAddress, query, historyPointerNext)
        break
      }
      case FilterType.MODULE: {
        txListPage = await getModuleTransactions(chainId, checksummedAddress, query, historyPointerNext)
        break
      }
      default: {
        txListPage = await getTransactionHistory(chainId, checksummedAddress, historyPointerNext)
      }
    }
  } catch (e) {
    // TODO:
  }

  const getFilteredPageUrl = (pageUrl?: string) => {
    if (!pageUrl || !filterType) {
      return pageUrl
    }
    return `${pageUrl}&${stringify(query)}`
  }

  historyPointers[chainId][safeAddress] = {
    next: getFilteredPageUrl(txListPage?.next),
    previous: getFilteredPageUrl(txListPage?.previous),
    filterType,
  }

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
    const { results, next } = await loadHistory(safeAddress)

    return { values: results, next }
  } catch (e) {
    throw new CodedException(Errors._602, e.message)
  }
}

export const loadHistoryTransactions = async (safeAddress: string): Promise<HistoryGatewayResponse['results']> => {
  try {
    const { results } = await loadHistory(safeAddress)

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
