//
import {} from 'redux'

import updateViewedSafes from 'logic/currentSession/store/actions/updateViewedSafes'
import {} from 'store'

const addViewedSafe = (safeAddress) => (dispatch) => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
