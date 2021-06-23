import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPagedQueuedTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addQueuedTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import { QueueTransactionsInfo, useQueueTransactions } from './useQueueTransactions'
import { Errors } from 'src/logic/exceptions/CodedException'
import { Await } from 'src/types/helpers'

type PagedQueuedTransactions = {
  count: number
  isLoading: boolean
  transactions?: QueueTransactionsInfo
  hasMore: boolean
  next: () => Promise<void>
}

export const usePagedQueuedTransactions = (): PagedQueuedTransactions => {
  const transactions = useQueueTransactions()
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeAddressFromUrl)
  const [hasMore, setHasMore] = useState(true)

  const nextPage = async () => {
    let results: Await<ReturnType<typeof loadPagedQueuedTransactions>>
    try {
      results = await loadPagedQueuedTransactions(safeAddress)
    } catch (e) {
      // No next page
      if (e.content !== Errors._608) {
        e.log()
      }
    }

    if (!results) {
      setHasMore(false)
      return
    }

    const { values, next } = results

    if (next === null) {
      setHasMore(false)
    }

    if (values) {
      dispatch(addQueuedTransactions({ safeAddress, values }))
    } else {
      setHasMore(false)
    }
  }

  let count
  if (transactions) {
    count = transactions.next.count + transactions.queue.count
  }

  const isLoading = typeof transactions === 'undefined' || typeof count === 'undefined'

  return { count, isLoading, transactions, hasMore, next: nextPage }
}
