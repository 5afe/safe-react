import updateSafe from './updateSafe'
import { Dispatch } from 'redux'
import { Set } from 'immutable'

const updateBlacklistedTokens = (safeAddress: string, blacklistedTokens: Set<string>) => (dispatch: Dispatch): void => {
  dispatch(updateSafe({ address: safeAddress, blacklistedTokens }))
}

export default updateBlacklistedTokens
