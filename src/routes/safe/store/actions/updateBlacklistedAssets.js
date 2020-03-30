// @flow
import { Set } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import { type GlobalState } from '~/store'

const updateBlacklistedAssets = (safeAddress: string, blacklistedAssets: Set<string>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, blacklistedAssets }))
}

export default updateBlacklistedAssets
