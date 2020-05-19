import { batch } from 'react-redux'

import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'src/logic/collectibles/store/actions/addCollectibles'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'

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
