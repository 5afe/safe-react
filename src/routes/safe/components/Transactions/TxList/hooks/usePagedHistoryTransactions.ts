import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPagedHistoryTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addHistoryTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { useHistoryTransactions } from 'src/routes/safe/components/Transactions/TxList/hooks/useHistoryTransactions'

type PagedTransactions = {
  count: number
  transactions: TransactionDetails['transactions']
  hasMore: boolean
  next: () => Promise<void>
  isLoading: boolean
}

export const usePagedHistoryTransactions = (): PagedTransactions => {
  const { count, transactions } = useHistoryTransactions()

  const dispatch = useRef(useDispatch())
  const safeAddress = useRef(useSelector(safeParamAddressFromStateSelector))
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const next = useCallback(async () => {
    setIsLoading(true)
    const results = await loadPagedHistoryTransactions(safeAddress.current)

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
      dispatch.current(addHistoryTransactions({ safeAddress: safeAddress.current, values, isTail: true }))
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }, [])

  return { count, transactions, hasMore, next, isLoading }
}
