import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPagedHistoryTransactions } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadGatewayTransactions'
import { addHistoryTransactions } from 'src/logic/safe/store/actions/transactions/gatewayTransactions'
import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { useHistoryTransactions } from 'src/routes/safe/components/GatewayTransactions/hooks/useHistoryTransactions'

type PagedTransactions = {
  count: number
  transactions: TransactionDetails['transactions']
  hasMore: boolean
  next: () => Promise<void>
}

export const usePagedHistoryTransactions = (): PagedTransactions => {
  const { count, transactions } = useHistoryTransactions()

  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [hasMore, setHasMore] = useState(true)

  const next = async () => {
    const results = await loadPagedHistoryTransactions(safeAddress)

    if (!results) {
      setHasMore(false)
      return
    }

    const { values, next } = results

    if (next === null) {
      setHasMore(false)
    }

    if (values) {
      dispatch(addHistoryTransactions({ safeAddress, values }))
    } else {
      setHasMore(false)
    }
  }

  return { count, transactions, hasMore, next }
}
