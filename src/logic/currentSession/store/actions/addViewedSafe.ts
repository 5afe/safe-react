import { Dispatch } from 'redux'

import updateViewedSafes from 'src/logic/currentSession/store/actions/updateViewedSafes'

const addViewedSafe = (safeAddress: string) => (dispatch: Dispatch): void => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
