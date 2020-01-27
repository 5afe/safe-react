// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/safeStore'
import updateSafe from './updateSafe'

const updateSafeName = (safeAddress: string, safeName: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(updateSafe({ address: safeAddress, name: safeName }))
}

export default updateSafeName
