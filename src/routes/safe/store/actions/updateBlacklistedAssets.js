import updateSafe from './updateSafe'

const updateBlacklistedAssets = (safeAddress, blacklistedAssets) => async (dispatch) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedAssets }))
}

export default updateBlacklistedAssets
