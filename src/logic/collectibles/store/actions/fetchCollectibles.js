// @flow
import type { Dispatch } from 'redux'

import { getConfiguredSource } from '~/logic/collectibles/sources'
import addCollectibles from '~/logic/collectibles/store/actions/addCollectibles'
import { PROVIDER_REDUCER_ID } from '~/logic/wallets/store/reducer/provider'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import type { GlobalState } from '~/store'

const fetchCollectibles = () => async (dispatch: Dispatch<GlobalState>, getState) => {
  const state = getState()
  const { network } = state[PROVIDER_REDUCER_ID]
  const safeAddress = safeParamAddressFromStateSelector(state)
  const source = getConfiguredSource()
  const collectibles = await source.fetchAllUserCollectiblesByCategoryAsync(safeAddress, network)
  dispatch(addCollectibles(collectibles))
}

export default fetchCollectibles
