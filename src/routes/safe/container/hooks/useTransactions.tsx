import { loadAllTransactions } from 'src/logic/safe/store/actions/transactionsNew/loadAllTransactions'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMore } from 'src/logic/safe/store/actions/transactionsNew/pagination'
import { safeNewTransactionsSelector } from 'src/logic/safe/store/selectors/newTransactions'
import { Transaction } from '../../../../logic/safe/store/models/types/transactions'

type Props = {
  safeAddress: string
  offset: number
  limit: number
}

export const useTransactions = (props: Props): Transaction[] => {
  const { safeAddress, offset, limit } = props
  const dispatch = useDispatch()
  const transactions = useSelector(safeNewTransactionsSelector)
  useEffect(() => {
    async function loadNewTxs() {
      const { transactions, totalTransactionsAmount } = await loadAllTransactions({ safeAddress, offset, limit })

      if (transactions.length) {
        dispatch(loadMore({ transactions, safeAddress, totalTransactionsAmount }))
      }
    }
    loadNewTxs()
  }, [dispatch, safeAddress, offset, limit])

  return transactions
}
