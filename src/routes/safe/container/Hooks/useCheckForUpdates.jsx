// @flow
import { useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import fetchSafeTokens from '~/logic/tokens/store/actions/fetchSafeTokens'
import fetchEtherBalance from '~/routes/safe/store/actions/fetchEtherBalance'
import { checkAndUpdateSafe } from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import { TIMEOUT } from '~/utils/constants'

export const useCheckForUpdates = () => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  useEffect(() => {
    if (safeAddress) {
      const collectiblesInterval = setInterval(() => {
        batch(() => {
          dispatch(fetchEtherBalance(safeAddress))
          dispatch(fetchSafeTokens(safeAddress))
          dispatch(fetchTransactions(safeAddress))
          dispatch(fetchCollectibles)
          dispatch(checkAndUpdateSafe(safeAddress))
        })
      }, TIMEOUT * 3)
      return () => {
        clearInterval(collectiblesInterval)
      }
    }
  }, [safeAddress])
}
