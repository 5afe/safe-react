// @flow
import { Set } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import { type GlobalState } from '~/store'

const updateActiveTokens = (safeAddress: string, activeTokens: Set<string>) => (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, activeTokens }))
}

export default updateActiveTokens
