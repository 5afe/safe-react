// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import updateSafe from './updateSafe'

import { type GlobalState } from '~/store'

const updateSafeName = (safeAddress: string, safeName: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(updateSafe({ address: safeAddress, name: safeName }))
}

export default updateSafeName
