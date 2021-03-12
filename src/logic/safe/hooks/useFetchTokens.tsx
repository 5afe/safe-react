import { useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { fetchCollectibles } from 'src/logic/collectibles/store/actions/fetchCollectibles'
import { fetchSelectedCurrency } from 'src/logic/currencyValues/store/actions/fetchSelectedCurrency'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { fetchTokens } from 'src/logic/tokens/store/actions/fetchTokens'
import { COINS_LOCATION_REGEX, COLLECTIBLES_LOCATION_REGEX } from 'src/routes/safe/components/Balances'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'

export const useFetchTokens = (safeAddress: string): void => {
  const dispatch = useDispatch<Dispatch>()
  const location = useLocation()
  const currentCurrency = useSelector(currentCurrencySelector)

  useMemo(() => {
    if (COINS_LOCATION_REGEX.test(location.pathname)) {
      batch(() => {
        // fetch tokens there to get symbols for tokens in TXs list
        dispatch(fetchTokens())
        dispatch(fetchSelectedCurrency())
        dispatch(fetchSafeTokens(safeAddress, currentCurrency))
      })
    }

    if (COLLECTIBLES_LOCATION_REGEX.test(location.pathname)) {
      dispatch(fetchCollectibles(safeAddress))
    }
  }, [dispatch, location.pathname, safeAddress, currentCurrency])
}
