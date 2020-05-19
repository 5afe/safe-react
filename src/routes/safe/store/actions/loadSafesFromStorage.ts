//

import { addSafe } from './addSafe'

import { SAFES_KEY } from 'logic/safe/utils'

import { buildSafe } from 'routes/safe/store/reducer/safe'

import { loadFromStorage } from 'utils/storage'

const loadSafesFromStorage = () => async (dispatch) => {
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
