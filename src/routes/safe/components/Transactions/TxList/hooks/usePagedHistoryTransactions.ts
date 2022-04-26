import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadPagedHistoryTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addHistoryTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { currentChainId } from 'src/logic/config/store/selectors'
import { useHistoryTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/useHistoryTransactions'
import { Errors } from 'src/logic/exceptions/CodedException'
import { Await } from 'src/types/helpers'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

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

  const dispatch = useDispatch()
  const { safeAddress } = useSafeAddress()
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const next = useCallback(async () => {
    setIsLoading(true)

    let results: Await<ReturnType<typeof loadPagedHistoryTransactions>>
    try {
      results = await loadPagedHistoryTransactions(safeAddress)
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
      dispatch(addHistoryTransactions({ chainId, safeAddress, values }))
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }, [chainId, dispatch, safeAddress])

  return { count, transactions, hasMore, next, isLoading }
}
