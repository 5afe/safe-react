// 
import { Set } from 'immutable'

import updateSafe from './updateSafe'

import { } from 'store'

const updateBlacklistedAssets = (safeAddress, blacklistedAssets) => async (
  dispatch,
) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedAssets }))
}

export default updateBlacklistedAssets
