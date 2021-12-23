import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { _getChainId } from 'src/config'
import { loadQueuedTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addQueuedTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { nextTransactions, queuedTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { extractSafeAddress } from 'src/routes/routes'

export type QueueTransactionsInfo = {
  next: TransactionDetails
  queue: TransactionDetails
}

/**
 * Get transactions (next and queue) from nextTransactions and queuedTransactions selectors
 */
export const useQueueTransactions = (): QueueTransactionsInfo | undefined => {
  const nextTxs = useSelector(nextTransactions)
  const queuedTxs = useSelector(queuedTransactions)
  const dispatch = useDispatch()
  const [txsCount, setTxsCount] = useState<{ next: number; queued: number } | undefined>()

  useEffect(() => {
    const next = nextTxs
      ? Object.entries(nextTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    const queued = queuedTxs
      ? Object.entries(queuedTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0

    // If 'queued.queued' deeplinked tx was open then queue visited before next poll
    const hasDeeplinkLoaded = next === 0 && queued === 1
    if (hasDeeplinkLoaded) {
      const getQueuedTxs = async () => {
        const safeAddress = extractSafeAddress()
        const values = await loadQueuedTransactions(safeAddress)
        dispatch(addQueuedTransactions({ chainId: _getChainId(), safeAddress, values }))
      }
      getQueuedTxs()
    }

    setTxsCount({ next, queued })
  }, [dispatch, nextTxs, queuedTxs])

  // no data loaded to the store yet
  if ((!nextTxs && !queuedTxs) || typeof txsCount === 'undefined') {
    return
  }

  return {
    next: {
      count: txsCount.next,
      transactions: nextTxs ? Object.entries(nextTxs) : [],
    },
    queue: {
      count: txsCount.queued,
      transactions: queuedTxs ? Object.entries(queuedTxs) : [],
    },
  }
}
