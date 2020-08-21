import { batch } from 'react-redux'

import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'src/logic/collectibles/store/actions/addCollectibles'
import { Dispatch } from 'redux'

const fetchCollectibles = (safeAddress: string) => async (dispatch: Dispatch): Promise<void> => {
  try {
    const network = getNetwork()
    const source = getConfiguredSource()
    const collectibles = await source.fetchAllUserCollectiblesByCategoryAsync(safeAddress, network)

    batch(() => {
      dispatch(addNftAssets(collectibles.nftAssets))
      dispatch(addNftTokens(collectibles.nftTokens))
    })
  } catch (error) {
    console.log('Error fetching collectibles:', error)
  }
}

export default fetchCollectibles
