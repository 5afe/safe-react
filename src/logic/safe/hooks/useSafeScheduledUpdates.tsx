import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { TIMEOUT } from 'src/utils/constants'

export const useSafeScheduledUpdates = (safeLoaded: boolean, safeAddress?: string): void => {
  const dispatch = useDispatch()
  const timer = useRef<number>()

  useEffect(() => {
    // using this variable to prevent setting a timeout when the component is already unmounted or the effect
    // has to run again
    let mounted = true
    const fetchSafeData = (address: string): void => {
      dispatch(fetchSafe(address, safeLoaded))
      dispatch(fetchSafeTokens(address))

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
