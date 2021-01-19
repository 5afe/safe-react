import { Action, Dispatch } from 'redux'
import { loadStoredSafes } from 'src/logic/safe/utils'
import removeSafe from 'src/logic/safe/store/actions/removeSafe'

export const removeLocalSafe = (safeAddress: string) => async (dispatch: Dispatch): Promise<Action | void> => {
  const storedSafes = await loadStoredSafes()
  if (storedSafes) {
    delete storedSafes[safeAddress]
  }
  dispatch(removeSafe(safeAddress))
}
