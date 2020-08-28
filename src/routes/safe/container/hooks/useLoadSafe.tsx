import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import loadAddressBookFromStorage from 'src/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchLatestMasterContractVersion from 'src/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from 'src/routes/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/routes/safe/store/actions/transactions/fetchTransactions'
import fetchSafeCreationTx from '../../store/actions/fetchSafeCreationTx'

export const useLoadSafe = (safeAddress) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = () => {
      if (safeAddress) {
        dispatch(fetchLatestMasterContractVersion())
          .then(() => {
            dispatch(fetchSafe(safeAddress))
            return dispatch(fetchSafeTokens(safeAddress))
          })
          .then(() => {
            dispatch(loadAddressBookFromStorage())
            dispatch(fetchSafeCreationTx(safeAddress))
            dispatch(fetchTransactions(safeAddress))
            return dispatch(addViewedSafe(safeAddress))
          })
      }
    }
    fetchData()
  }, [dispatch, safeAddress])
}
