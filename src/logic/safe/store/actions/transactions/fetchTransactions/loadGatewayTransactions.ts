import {
  getTransactionHistory,
  getTransactionQueue,
  TransactionListPage,
  // getIncomingTransfers,
  // getMultisigTransactions,
  // getModuleTransactions,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId } from 'src/config'
import { HistoryGatewayResponse, QueuedGatewayResponse } from 'src/logic/safe/store/models/types/gateway.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { parseSearch } from 'src/routes/safe/container/hooks/useSearchParams'
import { history } from 'src/routes/routes'
import { FilterType } from 'src/routes/safe/components/Transactions/TxList/Filter'

/*************/
/*  HISTORY  */
/*************/
const historyPointers: {
  [chainId: string]: { [safeAddress: string]: { next?: string; previous?: string; type?: FilterType } }
} = {}

export const loadHistory = async (safeAddress: string): Promise<TransactionListPage> => {
  const chainId = _getChainId()
  const checksummedAddress = checksumAddress(safeAddress)

  const query = parseSearch(history.location.search)
  const type = typeof query?.type === 'string' ? (query.type as FilterType) : undefined

  const hasFilter = type && type !== historyPointers?.[chainId]?.[checksummedAddress]?.type
  if (hasFilter) {
    console.log('reset history')
  }

  let txListPage: TransactionListPage & { type?: FilterType } = {
    results: [],
    next: '',
    previous: '',
    type,
  }

  try {
    switch (type) {
      case FilterType.INCOMING: {
        // txListPage = await getIncomingTransfers(chainId, checksummedAddress, query)
        console.log(FilterType.INCOMING, query)
        break
      }
      case FilterType.MULTISIG: {
        // txListPage = await getMultisigTransactions(chainId, checksummedAddress, query)
        console.log(FilterType.MULTISIG, query)
        break
      }
      case FilterType.MODULE: {
        // txListPage = await getModuleTransactions(chainId, checksummedAddress, query)
        console.log(FilterType.MODULE, query)
        break
      }
      default: {
        txListPage = await getTransactionHistory(chainId, checksummedAddress)
      }
    }
  } catch (e) {
    // TODO:
  }

  if (!historyPointers[chainId]) {
    historyPointers[chainId] = {}
  }

  if (!historyPointers[chainId][safeAddress]) {
    historyPointers[chainId][safeAddress] = {
      next: txListPage.next,
      previous: txListPage.previous,
      type,
    }
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
  // if `historyPointers[safeAddress] is `undefined` it means `loadHistoryTransactions` wasn't called
  // if `historyPointers[safeAddress].next is `null`, it means it reached the last page in gateway-client
  if (historyPointers[chainId]?.[safeAddress]?.type && !historyPointers[chainId]?.[safeAddress]?.next) {
    throw new CodedException(Errors._608)
  }

  try {
    const { results } = await loadHistory(safeAddress)

    return { values: results, next: historyPointers[chainId][safeAddress].next }
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
