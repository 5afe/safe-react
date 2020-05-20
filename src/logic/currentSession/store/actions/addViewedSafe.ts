import updateViewedSafes from 'src/logic/currentSession/store/actions/updateViewedSafes'
import {} from 'src/store'

const addViewedSafe = (safeAddress) => (dispatch) => {
  dispatch(updateViewedSafes(safeAddress))
}

export default addViewedSafe
