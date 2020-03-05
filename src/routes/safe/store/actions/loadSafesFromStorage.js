// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import { addSafe } from './addSafe'

import { SAFES_KEY } from '~/logic/safe/utils'
import { type SafeProps } from '~/routes/safe/store/models/safe'
import { buildSafe } from '~/routes/safe/store/reducer/safe'
import { type GlobalState } from '~/store/index'
import { loadFromStorage } from '~/utils/storage'

const loadSafesFromStorage = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const safes: ?{ [string]: SafeProps } = await loadFromStorage(SAFES_KEY)

    if (safes) {
      Object.values(safes).forEach((safeProps: SafeProps) => {
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
