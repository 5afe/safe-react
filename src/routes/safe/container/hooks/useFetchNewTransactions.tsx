import { loadAllTransactions } from '../../store/actions/transactionsNew/loadAllTransactions'
import { addNewTransactions } from '../../store/actions/transactionsNew/addNewTransactions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentPageSelector } from '../../store/selectors/newTransactions'
import { safeParamAddressFromStateSelector } from '../../store/selectors'

export const useFetchNewTransactions = (): void => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { offset, limit } = useSelector(currentPageSelector)

  useEffect(() => {
    async function loadNewTxs() {
      const allTransactions = await loadAllTransactions({ safeAddress, offset, limit })

      if (allTransactions[safeAddress].length) {
        dispatch(addNewTransactions({ transactions: allTransactions, safeAddress }))
      }
    }

    loadNewTxs()
  }, [dispatch, safeAddress, offset, limit])
}
