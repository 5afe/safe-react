// @flow
import { useMemo } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import { fetchCurrencyValues } from '~/logic/currencyValues/store/actions/fetchCurrencyValues'
import activateAssetsByBalance from '~/logic/tokens/store/actions/activateAssetsByBalance'
import fetchSafeTokens from '~/logic/tokens/store/actions/fetchSafeTokens'
import { fetchTokens } from '~/logic/tokens/store/actions/fetchTokens'
import { COINS_LOCATION_REGEX, COLLECTIBLES_LOCATION_REGEX } from '~/routes/safe/components/Balances'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import { history } from '~/store'

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
      dispatch(activateAssetsByBalance(address))
    }
  }, [history.location.pathname])
}
