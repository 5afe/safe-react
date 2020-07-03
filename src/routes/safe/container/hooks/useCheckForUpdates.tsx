import { useEffect } from 'react'
import { batch, useDispatch } from 'react-redux'

import fetchCollectibles from 'src/logic/collectibles/store/actions/fetchCollectibles'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchEtherBalance from 'src/routes/safe/store/actions/fetchEtherBalance'
import { checkAndUpdateSafe } from 'src/routes/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/routes/safe/store/actions/transactions/fetchTransactions'
// import { TIMEOUT } from 'src/utils/constants'

export const useCheckForUpdates = (safeAddress: string): void => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSafeData = async (address: string): Promise<void> => {
      console.log('fetch safe data called')

      await batch(async () => {
        await Promise.all([
          dispatch(fetchEtherBalance(address)),
          dispatch(fetchSafeTokens(address)),
          dispatch(fetchTransactions(address)),
          dispatch(fetchCollectibles(address)),
          dispatch(checkAndUpdateSafe(address)),
        ])
      })
    }

    if (safeAddress) {
      fetchSafeData(safeAddress)
      console.log('finished fetching safe data')

      return () => {}
    }
  }, [dispatch, safeAddress])
}
