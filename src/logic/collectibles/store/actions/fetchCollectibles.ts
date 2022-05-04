import { Dispatch } from 'redux'

import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens, setNftTokensLoaded } from 'src/logic/collectibles/store/actions/addCollectibles'

export const fetchCollectibles =
  (safeAddress: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(setNftTokensLoaded(false))
    try {
      const source = getConfiguredSource()
      const collectibles = await source.fetchCollectibles(safeAddress)

      dispatch(addNftAssets(collectibles.nftAssets))
      dispatch(addNftTokens(collectibles.nftTokens))
      dispatch(setNftTokensLoaded(true))
    } catch (error) {
      dispatch(setNftTokensLoaded(false))
      console.log('Error fetching collectibles:', error)
    }
  }
