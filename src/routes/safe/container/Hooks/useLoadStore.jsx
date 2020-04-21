// @flow
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'

type Props = {
  setSafeLoaded: Function,
  safeAddress: string,
}

export const useLoadStore = ({ safeAddress, setSafeLoaded }: Props) => {
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
}
