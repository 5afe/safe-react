import { addSafe } from './addSafe'

import { SAFES_KEY } from 'src/logic/safe/utils'

import { buildSafe } from 'src/logic/safe/store/reducer/safe'

import { loadFromStorage } from 'src/utils/storage'
import { Dispatch } from 'redux'

const loadSafesFromStorage = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    const safes = await loadFromStorage(SAFES_KEY)

    if (safes) {
      Object.values(safes).forEach((safeProps) => {
        dispatch(addSafe(buildSafe(safeProps)))
      })
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting Safes from storage:', err)
  }

  return Promise.resolve()
}

export default loadSafesFromStorage
