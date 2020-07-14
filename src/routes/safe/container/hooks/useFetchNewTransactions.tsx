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

      if (allTransactions[safeAddress].length) {
        dispatch(addNewTransactions({ transactions: allTransactions, safeAddress }))
      }
    }

    loadNewTxs()
  }, [dispatch, safeAddress, uriParams])
}
