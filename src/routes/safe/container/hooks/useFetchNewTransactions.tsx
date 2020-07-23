import { loadAllTransactions } from '../../store/actions/transactionsNew/loadAllTransactions'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadMore } from '../../store/actions/transactionsNew/pagination'

type Props = {
  safeAddress: string
  offset: number
  limit: number
}

export const useFetchNewTransactions = (props: Props): void => {
  const { safeAddress, offset, limit } = props
  const dispatch = useDispatch()

  useEffect(() => {
    async function loadNewTxs() {
      const { transactions, totalTransactionsAmount } = await loadAllTransactions({ safeAddress, offset, limit })

      if (transactions.length) {
        dispatch(loadMore({ transactions, safeAddress, totalTransactionsAmount }))
      }
    }

    loadNewTxs()
  }, [dispatch, safeAddress, offset, limit])
}
