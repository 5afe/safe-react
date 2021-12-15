import { Dispatch } from 'redux'
import { getLocalSafes } from 'src/logic/safe/utils'
import { buildSafe } from 'src/logic/safe/store/reducer/safe'
import { addOrUpdateSafe } from './addOrUpdateSafe'

const loadSafesFromStorage =
  () =>
  (dispatch: Dispatch): void => {
    const safes = getLocalSafes()

    if (safes) {
      safes.forEach((safeProps) => {
        dispatch(addOrUpdateSafe(buildSafe(safeProps)))
      })
    }
  }

export default loadSafesFromStorage
