// @flow
import { Set } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/safeStore'
import updateSafe from './updateSafe'

const updateBlacklistedTokens = (safeAddress: string, blacklistedTokens: Set<string>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedTokens }))
}

export default updateBlacklistedTokens
