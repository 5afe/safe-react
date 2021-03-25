import { useEffect, useRef } from 'react'
import { batch, useDispatch } from 'react-redux'

import { fetchCollectibles } from 'src/logic/collectibles/store/actions/fetchCollectibles'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { checkAndUpdateSafe } from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { TIMEOUT } from 'src/utils/constants'

export const useSafeScheduledUpdates = (safeLoaded: boolean, safeAddress?: string): void => {
  const dispatch = useDispatch()
  const timer = useRef<number>()

  useEffect(() => {
    // using this variable to prevent setting a timeout when the component is already unmounted or the effect
    // has to run again
    let mounted = true
    const fetchSafeData = async (address: string): Promise<void> => {
      batch(async () => {
        await Promise.all([
          dispatch(fetchSafeTokens(address)),
          dispatch(fetchTransactions(address)),
          dispatch(fetchCollectibles(address)),
          dispatch(checkAndUpdateSafe(address)),
        ])
      })
    }

    if (safeAddress && safeLoaded) {
      if (mounted && !timer.current) {
        timer.current = window.setTimeout(() => fetchSafeData(safeAddress), TIMEOUT * 3)
      }
    }

    return () => {
      mounted = false
      clearTimeout(timer.current)
    }
  }, [dispatch, safeAddress, safeLoaded])
}
