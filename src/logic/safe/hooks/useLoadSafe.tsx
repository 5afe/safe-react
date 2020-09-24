import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import loadAddressBookFromStorage from 'src/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchLatestMasterContractVersion from 'src/logic/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import fetchSafeCreationTx from 'src/logic/safe/store/actions/fetchSafeCreationTx'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

export const useLoadSafe = (safeAddress?: string): void => {
  const dispatch = useDispatch<Dispatch>()

  useEffect(() => {
    const fetchData = () => {
      if (safeAddress) {
        dispatch(fetchLatestMasterContractVersion())
          .then(() => {
            dispatch(fetchSafe(safeAddress))
            return dispatch(fetchSafeTokens(safeAddress))
          })
          .then(() => {
            dispatch(fetchSafeCreationTx(safeAddress))
            dispatch(fetchTransactions(safeAddress))
            return dispatch(addViewedSafe(safeAddress))
          })
      }
    }
    dispatch(loadAddressBookFromStorage())

    fetchData()
  }, [dispatch, safeAddress])
}
