import { Set } from 'immutable'
import updateAssetsList from './updateAssetsList'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

const updateActiveAssets = (safeAddress: string, activeAssets: Set<string>) => (dispatch: Dispatch): void => {
  dispatch(updateAssetsList({ safeAddress, activeAssets }))
}

export default updateActiveAssets
