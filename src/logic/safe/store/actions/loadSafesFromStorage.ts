import { Dispatch } from 'redux'

import { SAFES_KEY } from 'src/logic/safe/utils'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { buildSafe } from 'src/logic/safe/store/reducer/safe'
import { loadFromStorage } from 'src/utils/storage'

import { addOrUpdateSafe } from './addOrUpdateSafe'

const loadSafesFromStorage = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    const safes = await loadFromStorage<Record<string, SafeRecordProps>>(SAFES_KEY)

    if (safes) {
      Object.values(safes).forEach((safeProps) => {
        dispatch(addOrUpdateSafe(buildSafe(safeProps), true))
      })
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting Safes from storage:', err)
  }

  return Promise.resolve()
}

export default loadSafesFromStorage
