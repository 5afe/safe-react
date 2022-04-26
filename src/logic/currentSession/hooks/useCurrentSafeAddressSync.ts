import { useEffect } from 'react'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { extractPrefixedSafeAddress } from 'src/routes/routes'
import addCurrentSafeAddress from 'src/logic/currentSession/store/actions/addCurrentSafeAddress'
import addCurrentShortName from '../store/actions/addCurrentShortName'

export const useCurrentSafeAddressSync = (): void => {
  const dispatch = useDispatch<Dispatch>()
  const location = useLocation()

  useEffect(() => {
    const { shortName, safeAddress } = extractPrefixedSafeAddress(location.pathname)
    dispatch(addCurrentShortName(shortName))
    dispatch(addCurrentSafeAddress(safeAddress))
  }, [location.pathname, dispatch])
}
