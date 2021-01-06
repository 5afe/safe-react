import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { TransactionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { historyTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'

export const useHistoryTransactions = (): TransactionDetails => {
  const historyTxs = useSelector(historyTransactions)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const history = historyTxs
      ? Object.entries(historyTxs).reduce((acc, [, transactions]) => (acc += transactions.length), 0)
      : 0
    setCount(history)
  }, [historyTxs])

  return {
    count,
    transactions: historyTxs ? Object.entries(historyTxs) : [],
  }
}
