import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPagedHistoryTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addHistoryTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { currentChainId } from 'src/logic/config/store/selectors'
import { useHistoryTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/useHistoryTransactions'
import { Errors } from 'src/logic/exceptions/CodedException'
import { Await } from 'src/types/helpers'
import { extractSafeAddress } from 'src/routes/routes'

type PagedTransactions = {
  count: number
  transactions: TransactionDetails['transactions']
  hasMore: boolean
  next: () => Promise<void>
  isLoading: boolean
}

export const usePagedHistoryTransactions = (): PagedTransactions => {
  const { count, transactions } = useHistoryTransactions()
  const chainId = useSelector(currentChainId)

  const dispatch = useRef(useDispatch())
  const safeAddress = useRef(extractSafeAddress())
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const next = useCallback(async () => {
    setIsLoading(true)

    let results: Await<ReturnType<typeof loadPagedHistoryTransactions>>
    try {
      results = await loadPagedHistoryTransactions(safeAddress.current)
    } catch (e) {
      // No next page
      if (e.content !== Errors._608) {
        e.log()
      }
    }

    if (!results) {
      setHasMore(false)
      setIsLoading(false)
      return
    }

    const { values, next } = results

    if (next === null) {
      setHasMore(false)
    }

    if (values) {
      dispatch.current(addHistoryTransactions({ chainId, safeAddress: safeAddress.current, values, isTail: true }))
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }, [chainId])

  return { count, transactions, hasMore, next, isLoading }
}
