// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import updateSafe from './updateSafe'

const updateUserStatus = (safeAddress: string, recurrentUser?: boolean) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, recurringUser: !recurrentUser }))
}

export default updateUserStatus
