import { loadAllTransactions } from '../../store/actions/transactionsNew/loadAllTransactions'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentPageSelector } from '../../store/selectors/newTransactions'
import { safeParamAddressFromStateSelector } from '../../store/selectors'
import { loadMore } from '../../store/actions/transactionsNew/pagination'

export const useFetchNewTransactions = (): void => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { offset, limit } = useSelector(currentPageSelector)

  useEffect(() => {
    async function loadNewTxs() {
      const { transactions, count } = await loadAllTransactions({ safeAddress, offset, limit })

      if (transactions.length) {
        dispatch(loadMore({ transactions, safeAddress, count }))
      }
    }

    loadNewTxs()
  }, [dispatch, safeAddress, offset, limit])
}
