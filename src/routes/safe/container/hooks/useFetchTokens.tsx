//
import { useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from 'src/logic/collectibles/store/actions/fetchCollectibles'
import { fetchCurrencyValues } from 'src/logic/currencyValues/store/actions/fetchCurrencyValues'
import activateAssetsByBalance from 'src/logic/tokens/store/actions/activateAssetsByBalance'
import fetchSafeTokens from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { fetchTokens } from 'src/logic/tokens/store/actions/fetchTokens'
import { COINS_LOCATION_REGEX, COLLECTIBLES_LOCATION_REGEX } from 'src/routes/safe/components/Balances'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { history } from 'src/store'

export const useFetchTokens = () => {
  const dispatch = useDispatch()
  const address = useSelector(safeParamAddressFromStateSelector)
  useMemo(() => {
    if (COINS_LOCATION_REGEX.test(history.location.pathname)) {
      batch(() => {
        // fetch tokens there to get symbols for tokens in TXs list
        dispatch(fetchTokens())
        dispatch(fetchCurrencyValues(address))
        dispatch(fetchSafeTokens(address))
      })
    }

    if (COLLECTIBLES_LOCATION_REGEX.test(history.location.pathname)) {
      batch(() => {
        dispatch(fetchCollectibles()).then(() => {
          dispatch(activateAssetsByBalance(address))
        })
      })
    }
  }, [address, dispatch])
}
