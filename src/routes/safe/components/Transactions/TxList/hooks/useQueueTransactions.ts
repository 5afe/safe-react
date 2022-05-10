import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { nextTransactions, queuedTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

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
