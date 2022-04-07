import { useSelector } from 'react-redux'
import { pendingTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'

type TxnEntries = {
  count: number
  transactions: Array<[string, Transaction[]]>
}

type PagedQueuedTransactions = {
  count: number
  isLoading: boolean
  transactions?: {
    next: TxnEntries
    queue: TxnEntries
  }
  hasMore: boolean
  next: () => Promise<void>
}

export const usePagedQueuedTransactions = (): PagedQueuedTransactions => {
  const queueTxns = useSelector(pendingTransactions)
  const countNext = queueTxns ? Object.keys(queueTxns.next).length : 0
  const countQueued = queueTxns ? Object.keys(queueTxns.queued).length : 0

  return {
    count: countNext + countQueued,
    isLoading: !queueTxns,
    transactions: {
      next: {
        count: countNext,
        transactions: Object.entries(queueTxns?.next || {}),
      },
      queue: {
        count: countQueued,
        transactions: Object.entries(queueTxns?.queued || {}),
      },
    },
    hasMore: false,
    next: () => Promise.resolve(),
  }
}
