// 
import { Set } from 'immutable'

import updateSafe from './updateSafe'

import { } from 'src/store'

const updateBlacklistedTokens = (safeAddress, blacklistedTokens) => async (
  dispatch,
) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedTokens }))
}

export default updateBlacklistedTokens
