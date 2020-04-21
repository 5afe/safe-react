// @flow
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

export const useLoadSafe = (safeAddress: ?string) => {
  const [safeLoaded, setSafeLoaded] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = () => {
      if (safeAddress) {
        dispatch(fetchLatestMasterContractVersion())
          .then(() => dispatch(fetchSafe(safeAddress)))
          .then(() => {
            setSafeLoaded(true)
            dispatch(loadAddressBookFromStorage())
            return dispatch(fetchTransactions(safeAddress))
          })
          .then(() => dispatch(addViewedSafe(safeAddress)))
      }
    }
    fetchData()
  }, [safeAddress])

  return {
    safeLoaded,
  }
}
