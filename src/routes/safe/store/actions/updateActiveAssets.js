// @flow
import { Set } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import { type GlobalState } from '~/store'

const updateActiveAssets = (safeAddress: string, activeAssets: Set<string>) => (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, activeAssets }))
}

export default updateActiveAssets
