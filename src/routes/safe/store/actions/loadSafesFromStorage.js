// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { SAFES_KEY } from '~/logic/safe/utils'
import { type SafeProps } from '~/routes/safe/store/model/safe'
import { loadFromStorage } from '~/utils/storage'
import { addSafe } from './addSafe'
import { buildSafe } from '~/routes/safe/store/reducer/safe'

export default () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const safes: ?{ [string]: SafeProps } = await loadFromStorage(SAFES_KEY)

    if (safes) {
      Object.values(safes).forEach((safeProps: SafeProps) => {
        dispatch(addSafe(buildSafe(safeProps)))
      })
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting safes from storage:', err)
  }

  return Promise.resolve()
}
