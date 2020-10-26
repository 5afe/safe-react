import { useMemo } from 'react'
import { batch, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { fetchCollectibles } from 'src/logic/collectibles/store/actions/fetchCollectibles'
import { fetchSelectedCurrency } from 'src/logic/currencyValues/store/actions/fetchSelectedCurrency'
import activateAssetsByBalance from 'src/logic/tokens/store/actions/activateAssetsByBalance'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { fetchTokens } from 'src/logic/tokens/store/actions/fetchTokens'
import { COINS_LOCATION_REGEX, COLLECTIBLES_LOCATION_REGEX } from 'src/routes/safe/components/Balances'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

export const useFetchTokens = (safeAddress: string): void => {
  const dispatch = useDispatch<Dispatch>()
  const location = useLocation()

  useMemo(() => {
    if (COINS_LOCATION_REGEX.test(location.pathname)) {
      batch(() => {
        // fetch tokens there to get symbols for tokens in TXs list
        dispatch(fetchTokens())
        dispatch(fetchSelectedCurrency(safeAddress))
        dispatch(fetchSafeTokens(safeAddress))
      })
    }

    if (COLLECTIBLES_LOCATION_REGEX.test(location.pathname)) {
      batch(() => {
        dispatch(fetchCollectibles(safeAddress)).then(() => {
          dispatch(activateAssetsByBalance(safeAddress))
        })
      })
    }
  }, [dispatch, location.pathname, safeAddress])
}
