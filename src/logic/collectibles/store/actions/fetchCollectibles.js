// 
import { batch } from 'react-redux'

import { getNetwork } from 'config'
import { getConfiguredSource } from 'logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'logic/collectibles/store/actions/addCollectibles'
import { safeParamAddressFromStateSelector } from 'routes/safe/store/selectors'

const fetchCollectibles = () => async (dispatch, getState) => {
  const network = getNetwork()
  const safeAddress = safeParamAddressFromStateSelector(getState()) || ''
  const source = getConfiguredSource()
  const collectibles = await source.fetchAllUserCollectiblesByCategoryAsync(safeAddress, network)

  batch(() => {
    dispatch(addNftAssets(collectibles.nftAssets))
    dispatch(addNftTokens(collectibles.nftTokens))
  })
}

export default fetchCollectibles
