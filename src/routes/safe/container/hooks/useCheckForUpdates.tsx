import { useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from 'src/logic/collectibles/store/actions/fetchCollectibles'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchEtherBalance from 'src/routes/safe/store/actions/fetchEtherBalance'
import { checkAndUpdateSafe } from 'src/routes/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/routes/safe/store/actions/transactions/fetchTransactions'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { TIMEOUT } from 'src/utils/constants'

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
  }, [dispatch, safeAddress])
}
