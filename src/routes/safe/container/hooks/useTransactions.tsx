import { loadAllTransactions } from 'src/logic/safe/store/actions/transactionsNew/loadAllTransactions'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMore } from 'src/logic/safe/store/actions/transactionsNew/pagination'
import { safeAllTransactionsSelector } from 'src/logic/safe/store/selectors/allTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/transactions'
import { safeParamAddressFromStateSelector } from '../../../../logic/safe/store/selectors'

type Props = {
  offset: number
  limit: number
}

export const useTransactions = (props: Props): { transactions: Transaction[]; totalTransactionsCount: number } => {
  const { offset, limit } = props
  const dispatch = useDispatch()
  const transactions = useSelector(safeAllTransactionsSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0)
  useEffect(() => {
    async function loadNewTxs() {
      const { transactions, totalTransactionsAmount } = await loadAllTransactions({ safeAddress, offset, limit })
      setTotalTransactionsCount(totalTransactionsAmount)
      if (transactions.length) {
        dispatch(loadMore({ transactions, safeAddress }))
      }
    }
    loadNewTxs()
  }, [dispatch, safeAddress, offset, limit, setTotalTransactionsCount])

  return { transactions, totalTransactionsCount }
}
