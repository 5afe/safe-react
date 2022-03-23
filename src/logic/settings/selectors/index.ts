import { AppReduxState } from 'src/store'
import { ADVANCED_SETTINGS_REDUCER_ID } from 'src/logic/settings/reducer/advanced'

export const batchExecuteSelector = (state: AppReduxState): boolean => state[ADVANCED_SETTINGS_REDUCER_ID].batchExecute
