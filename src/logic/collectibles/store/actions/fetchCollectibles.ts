import { batch } from 'react-redux'

import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/collectibles/sources'
import { addNftAssets, addNftTokens } from 'src/logic/collectibles/store/actions/addCollectibles'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'

let isFetchingData = false

const fetchCollectibles = () => async (dispatch, getState) => {
  if (isFetchingData) return
  isFetchingData = true
  try {
    const network = getNetwork()
    const safeAddress = safeParamAddressFromStateSelector(getState()) || ''
    const source = getConfiguredSource()
    const collectibles = await source.fetchAllUserCollectiblesByCategoryAsync(safeAddress, network)

    batch(() => {
      dispatch(addNftAssets(collectibles.nftAssets))
      dispatch(addNftTokens(collectibles.nftTokens))
    })
  } catch (error) {
    console.log('Error fetching collectibles:', error)
  } finally {
    isFetchingData = false
  }
}

export default fetchCollectibles
