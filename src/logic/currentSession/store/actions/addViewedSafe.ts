//

import updateViewedSafes from 'logic/currentSession/store/actions/updateViewedSafes'

const addViewedSafe = (safeAddress) => (dispatch) => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
