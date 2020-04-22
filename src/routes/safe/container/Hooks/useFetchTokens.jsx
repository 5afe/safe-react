// @flow
import { useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import { fetchCurrencyValues } from '~/logic/currencyValues/store/actions/fetchCurrencyValues'
import activateAssetsByBalance from '~/logic/tokens/store/actions/activateAssetsByBalance'
import fetchSafeTokens from '~/logic/tokens/store/actions/fetchSafeTokens'
import { fetchTokens } from '~/logic/tokens/store/actions/fetchTokens'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

export const useFetchTokens = () => {
  const dispatch = useDispatch()
  const address = useSelector(safeParamAddressFromStateSelector)
  useEffect(() => {
    batch(() => {
      dispatch(fetchCollectibles())
      // fetch tokens there to get symbols for tokens in TXs list
      dispatch(fetchTokens())
      dispatch(fetchCurrencyValues(address))
      dispatch(fetchSafeTokens(address))
      dispatch(activateAssetsByBalance(address))
    })
  }, [])
}
