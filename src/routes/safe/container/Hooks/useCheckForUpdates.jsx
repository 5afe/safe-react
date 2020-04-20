// @flow
import { useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import { extendedSafeTokensSelector } from '~/routes/safe/container/selector'
import fetchEtherBalance from '~/routes/safe/store/actions/fetchEtherBalance'
import { checkAndUpdateSafe } from '~/routes/safe/store/actions/fetchSafe'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import { TIMEOUT } from '~/utils/constants'

export const useCheckForUpdates = () => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const activeTokens = useSelector(extendedSafeTokensSelector)
  useEffect(() => {
    if (safeAddress) {
      const interval = setInterval(() => {
        batch(() => {
          dispatch(fetchTokenBalances(safeAddress, activeTokens))
          dispatch(fetchEtherBalance(safeAddress))
        })
      }, TIMEOUT)
      const collectiblesInterval = setInterval(() => {
        batch(() => {
          dispatch(fetchTransactions(safeAddress))
          dispatch(fetchCollectibles)
          dispatch(checkAndUpdateSafe(safeAddress))
        })
      }, TIMEOUT * 3)
      return () => {
        clearInterval(interval)
        clearInterval(collectiblesInterval)
      }
    }
  }, [safeAddress])
}
