import { useEffect } from 'react'
import { extractPrefixedSafeAddress, history } from 'src/routes/routes'
import addCurrentSafeAddress from 'src/logic/currentSession/store/actions/addCurrentSafeAddress'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

export const useCurrentSafeAddressSync = (): void => {
  const dispatch = useDispatch<Dispatch>()

  useEffect(() => {
    dispatch(addCurrentSafeAddress(extractPrefixedSafeAddress(location.pathname).safeAddress))

    const unsubscribe = history.listen((location) => {
      dispatch(addCurrentSafeAddress(extractPrefixedSafeAddress(location.pathname).safeAddress))
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch])
}
