// @flow
import type { Dispatch } from 'redux'

import { getNetwork } from '~/config'
import { getConfiguredSource } from '~/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from '~/logic/collectibles/store/actions/addCollectibles'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import type { GlobalState } from '~/store'

const fetchCollectibles = () => async (dispatch: Dispatch<GlobalState>, getState) => {
  const network = getNetwork()
  const safeAddress = safeParamAddressFromStateSelector(getState()) || ''
  const source = getConfiguredSource()
  const collectibles = await source.fetchAllUserCollectiblesByCategoryAsync(safeAddress, network)

  dispatch(addNftAssets(collectibles.nftAssets))
  dispatch(addNftTokens(collectibles.nftTokens))
}

export default fetchCollectibles
