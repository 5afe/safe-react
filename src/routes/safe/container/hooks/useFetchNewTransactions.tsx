import { loadAllTransactions, ServiceUriParams } from '../../store/actions/transactionsNew/loadAllTransactions'
import { addNewTransactions } from '../../store/actions/transactionsNew/addNewTransactions'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const useFetchNewTransactions = (uriParams: ServiceUriParams): void => {
  const dispatch = useDispatch()
  const { safeAddress } = uriParams

  useEffect(() => {
    async function loadNewTxs() {
      const allTransactions = await loadAllTransactions(uriParams)

      if (allTransactions.transactions[safeAddress].length) {
        dispatch(addNewTransactions(allTransactions))
      }
    }

    loadNewTxs()
  }, [dispatch, safeAddress, uriParams])
}
