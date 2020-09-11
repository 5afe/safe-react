import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { AppReduxState } from 'src/store'

import updateViewedSafes from 'src/logic/currentSession/store/actions/updateViewedSafes'

const addViewedSafe = (safeAddress: string) => (dispatch: ThunkDispatch<AppReduxState, undefined, AnyAction>): void => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
