import { loadAllTransactions } from 'src/logic/safe/store/actions/allTransactions/loadAllTransactions'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMore } from 'src/logic/safe/store/actions/allTransactions/pagination'
import {
  safeAllTransactionsSelector,
  safeTotalTransactionsAmountSelector,
} from 'src/logic/safe/store/selectors/allTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/transactions.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'

type Props = {
  offset: number
  limit: number
}

export const useTransactions = (props: Props): { transactions: Transaction[]; totalTransactionsCount: number } => {
  const { offset, limit } = props
  const dispatch = useDispatch()
  const transactions = useSelector(safeAllTransactionsSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector) as string
  const totalTransactionsCount = useSelector(safeTotalTransactionsAmountSelector)
  useEffect(() => {
    async function loadNewTxs() {
      const { transactions, totalTransactionsAmount } = await loadAllTransactions({ safeAddress, offset, limit })
      if (transactions.length) {
        dispatch(loadMore({ transactions, safeAddress, totalTransactionsAmount }))
      }
    }
    loadNewTxs()
  }, [dispatch, safeAddress, offset, limit])

  return { transactions, totalTransactionsCount }
}
