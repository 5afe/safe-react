import { useEffect } from 'react'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { extractPrefixedSafeAddress } from 'src/routes/routes'
import addCurrentSafeAddress from 'src/logic/currentSession/store/actions/addCurrentSafeAddress'

export const useCurrentSafeAddressSync = (): void => {
  const dispatch = useDispatch<Dispatch>()
  const location = useLocation()

  useEffect(() => {
    dispatch(addCurrentSafeAddress(extractPrefixedSafeAddress(location.pathname).safeAddress))
  }, [location.pathname, dispatch])
}
