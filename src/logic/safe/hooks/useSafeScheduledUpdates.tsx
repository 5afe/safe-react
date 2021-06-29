import { useEffect, useRef } from 'react'
import { batch, useDispatch } from 'react-redux'

import { fetchCollectibles } from 'src/logic/collectibles/store/actions/fetchCollectibles'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
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
          dispatch(fetchSafe(address)),
        ])
      })

      if (mounted) {
        timer.current = window.setTimeout(() => fetchSafeData(address), TIMEOUT * 3)
      }
    }

    if (safeAddress && safeLoaded) {
      fetchSafeData(safeAddress)
    }

    return () => {
      mounted = false
      clearTimeout(timer.current)
    }
  }, [dispatch, safeAddress, safeLoaded])
}
