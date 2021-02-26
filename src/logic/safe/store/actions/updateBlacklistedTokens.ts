import { Set } from 'immutable'
import updateTokensList from './updateTokensList'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

const updateBlacklistedTokens = (safeAddress: string, blacklistedTokens: Set<string>) => (dispatch: Dispatch): void => {
  dispatch(updateTokensList({ safeAddress, blacklistedTokens }))
}

export default updateBlacklistedTokens
