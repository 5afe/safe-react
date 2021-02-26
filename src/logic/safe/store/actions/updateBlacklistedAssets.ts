import { Set } from 'immutable'
import updateAssetsList from './updateAssetsList'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

const updateBlacklistedAssets = (safeAddress: string, blacklistedAssets: Set<string>) => (dispatch: Dispatch): void => {
  dispatch(updateAssetsList({ safeAddress, blacklistedAssets }))
}

export default updateBlacklistedAssets
