// @flow
import { Set } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import { type GlobalState } from '~/store'

const updateBlacklistedTokens = (safeAddress: string, blacklistedTokens: Set<string>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedTokens }))
}

export default updateBlacklistedTokens
