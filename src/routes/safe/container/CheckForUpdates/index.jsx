// @flow
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import fetchEtherBalance from '~/routes/safe/store/actions/fetchEtherBalance'
import { checkAndUpdateSafe } from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeSelector } from '~/routes/safe/store/selectors'
import { TIMEOUT } from '~/utils/constants'

const CheckForUpdates = () => {
  const dispatch = useDispatch()
  const safe = useSelector(safeSelector)
  const { activeTokens, address } = safe
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkAndUpdateSafe(address))
      dispatch(fetchTokenBalances(address, activeTokens))
      dispatch(fetchEtherBalance(safe))
      dispatch(fetchTransactions(address))
    }, TIMEOUT)
    const collectiblesInterval = setInterval(() => {
      dispatch(fetchCollectibles)
    }, TIMEOUT * 3)
    return () => {
      clearInterval(interval)
      clearInterval(collectiblesInterval)
    }
  }, [])
  return null
}

export default CheckForUpdates
