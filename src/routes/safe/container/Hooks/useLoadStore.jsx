// @flow
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

export const useLoadStore = (setSafeLoaded: Function) => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

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
}
