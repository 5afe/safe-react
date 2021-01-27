import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPagedQueuedTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addQueuedTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { QueueTransactionsInfo, useQueueTransactions } from './useQueueTransactions'

type PagedQueuedTransactions = {
  count: number
  transactions: QueueTransactionsInfo
  hasMore: boolean
  next: () => Promise<void>
}

export const usePagedQueuedTransactions = (): PagedQueuedTransactions => {
  const { next, queue } = useQueueTransactions()
  const count = next.count + queue.count

  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [hasMore, setHasMore] = useState(true)

  const nextPage = async () => {
    const results = await loadPagedQueuedTransactions(safeAddress)

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

  return { count, transactions: { next, queue }, hasMore, next: nextPage }
}
