import { batch } from 'react-redux'

import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'src/logic/collectibles/store/actions/addCollectibles'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { Dispatch } from 'redux'
import { GnosisState } from 'src/store'

const fetchCollectibles = (): ((dispatch: Dispatch, getState: () => GnosisState) => Promise<void>) => async (
  dispatch,
  getState,
) => {
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
