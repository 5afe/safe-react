// @flow
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

type Props = {
  setSafeLoaded: Function,
}

const LoadStore = (props: Props) => {
  const dispatch = useDispatch()
  const safeUrl = useSelector(safeParamAddressFromStateSelector)

  const { setSafeLoaded } = props
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchLatestMasterContractVersion())
        .then(() => dispatch(fetchSafe(safeUrl)))
        .then(() => {
          setSafeLoaded(true)
          // The safe needs to be loaded before fetching the transactions
          dispatch(fetchTransactions(safeUrl))
          dispatch(addViewedSafe(safeUrl))
        })
      dispatch(loadAddressBookFromStorage())
    }
    fetchData()
  }, [])
  return null
}

export default LoadStore
