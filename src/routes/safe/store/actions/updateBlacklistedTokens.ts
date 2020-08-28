import updateSafe from './updateSafe'

const updateBlacklistedTokens = (safeAddress, blacklistedTokens) => async (dispatch) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedTokens }))
}

export default updateBlacklistedTokens
