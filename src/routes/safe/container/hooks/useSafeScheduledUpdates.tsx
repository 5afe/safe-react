import { useEffect, useRef } from 'react'
import { batch, useDispatch } from 'react-redux'

import fetchCollectibles from 'src/logic/collectibles/store/actions/fetchCollectibles'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchEtherBalance from 'src/routes/safe/store/actions/fetchEtherBalance'
import { checkAndUpdateSafe } from 'src/routes/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/routes/safe/store/actions/transactions/fetchTransactions'
import { TIMEOUT } from 'src/utils/constants'

export const useSafeScheduledUpdates = (safeAddress: string): void => {
  const dispatch = useDispatch()
  const timer = useRef<number>(null)

  useEffect(() => {
    let mounted = true // using this variable to prevent setting a timeout when the component is already unmounted
    const fetchSafeData = async (address: string): Promise<void> => {
      await batch(async () => {
        await Promise.all([
          dispatch(fetchEtherBalance(address)),
          dispatch(fetchSafeTokens(address)),
          dispatch(fetchTransactions(address)),
          dispatch(fetchCollectibles(address)),
          dispatch(checkAndUpdateSafe(address)),
        ])
      })

      if (mounted) {
        timer.current = setTimeout(() => {
          fetchSafeData(safeAddress)
        }, TIMEOUT * 3)
      }
    }

    if (safeAddress) {
      fetchSafeData(safeAddress)

      return () => {
        mounted = false
        clearTimeout(timer.current)
      }
    }
  }, [dispatch, safeAddress])
}
