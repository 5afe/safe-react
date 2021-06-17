import { Dispatch } from 'redux'
import { getLocalSafes } from 'src/logic/safe/utils'
import { buildSafe } from 'src/logic/safe/store/reducer/safe'
import { addOrUpdateSafe } from './addOrUpdateSafe'

const loadSafesFromStorage = () => async (dispatch: Dispatch): Promise<void> => {
  const safes = await getLocalSafes()

  if (safes) {
    safes.forEach((safeProps) => {
      dispatch(addOrUpdateSafe(buildSafe(safeProps)))
    })
  }

  return Promise.resolve()
}

export default loadSafesFromStorage
