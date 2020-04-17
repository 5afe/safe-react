// @flow
import { useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import fetchCollectibles from '~/logic/collectibles/store/actions/fetchCollectibles'
import { fetchCurrencyValues } from '~/logic/currencyValues/store/actions/fetchCurrencyValues'
import activateAssetsByBalance from '~/logic/tokens/store/actions/activateAssetsByBalance'
import activateTokensByBalance from '~/logic/tokens/store/actions/activateTokensByBalance'
import { fetchTokens } from '~/logic/tokens/store/actions/fetchTokens'
import { extendedSafeTokensSelector } from '~/routes/safe/container/selector'
import fetchTokenBalances from '~/routes/safe/store/actions/fetchTokenBalances'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

export const useFetchTokens = () => {
  const dispatch = useDispatch()
  const address = useSelector(safeParamAddressFromStateSelector)
  const activeTokens = useSelector(extendedSafeTokensSelector)
  useEffect(() => {
    batch(() => {
      dispatch(fetchTokenBalances(address, activeTokens))
      dispatch(fetchCollectibles())
      // fetch tokens there to get symbols for tokens in TXs list
      dispatch(fetchTokens())
      dispatch(fetchCurrencyValues(address))
      dispatch(activateTokensByBalance(address))
      dispatch(activateAssetsByBalance(address))
    })
  }, [])
}
