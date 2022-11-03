import { useDispatch, useSelector } from 'react-redux'
import { loadPagedQueuedTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addQueuedTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { currentChainId } from 'src/logic/config/store/selectors'
import { QueueTransactionsInfo, useQueueTransactions } from './useQueueTransactions'
import { Errors } from 'src/logic/exceptions/CodedException'
import { Await } from 'src/types/helpers'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

type PagedQueuedTransactions = {
  count: number
  isLoading: boolean
  transactions?: QueueTransactionsInfo
  next: () => Promise<void>
}

export const usePagedQueuedTransactions = (): PagedQueuedTransactions => {
  const transactions = useQueueTransactions()
  const chainId = useSelector(currentChainId)

  const dispatch = useDispatch()
  const { safeAddress } = useSafeAddress()

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

    if (results) {
      dispatch(addQueuedTransactions({ chainId, safeAddress, values: results.values }))
    }
  }

  let count
  if (transactions) {
    count = transactions.next.count + transactions.queue.count
  }

  const isLoading = typeof transactions === 'undefined' || typeof count === 'undefined'

  return { count, isLoading, transactions, next: nextPage }
}
