import { batch } from 'react-redux'
import { Dispatch } from 'redux'

import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'src/logic/collectibles/store/actions/addCollectibles'

export const fetchCollectibles = (safeAddress: string) => async (dispatch: Dispatch): Promise<void> => {
  try {
    const source = getConfiguredSource()
    const collectibles = await source.fetchCollectibles(safeAddress)

    batch(() => {
      dispatch(addNftAssets(collectibles.nftAssets))
      dispatch(addNftTokens(collectibles.nftTokens))
    })
  } catch (error) {
    console.log('Error fetching collectibles:', error)
  }
}
