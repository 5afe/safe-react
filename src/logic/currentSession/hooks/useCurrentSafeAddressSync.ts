import { useEffect } from 'react'
import { Dispatch } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { extractPrefixedSafeAddress } from 'src/routes/routes'
import addCurrentSafeAddress from 'src/logic/currentSession/store/actions/addCurrentSafeAddress'
import addCurrentShortName from '../store/actions/addCurrentShortName'
import { currentSession } from '../store/selectors'

export const useCurrentSafeAddressSync = (): void => {
  const dispatch = useDispatch<Dispatch>()
  const location = useLocation()
  const { currentShortName, currentSafeAddress } = useSelector(currentSession)

  useEffect(() => {
    const { shortName, safeAddress } = extractPrefixedSafeAddress(location.pathname)

    if (currentShortName !== shortName) {
      dispatch(addCurrentShortName(shortName))
    }
    if (currentSafeAddress !== safeAddress) {
      dispatch(addCurrentSafeAddress(safeAddress))
    }
  }, [location.pathname, dispatch, currentShortName, currentSafeAddress])
}
