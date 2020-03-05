// @flow
import { type Dispatch as ReduxDispatch } from 'redux'

import updateViewedSafes from '~/logic/currentSession/store/actions/updateViewedSafes'
import { type GlobalState } from '~/store'

const addViewedSafe = (safeAddress: string) => (dispatch: ReduxDispatch<GlobalState>) => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
