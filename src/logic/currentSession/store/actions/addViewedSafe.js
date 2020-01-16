// @flow
import { type Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import updateViewedSafes from '~/logic/currentSession/store/actions/updateViewedSafes'

const addViewedSafe = (safeAddress: string) => (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
