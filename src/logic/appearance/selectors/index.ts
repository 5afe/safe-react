import { AppReduxState } from 'src/store'
import { APPEARANCE_REDUCER_ID } from '../reducer/appearance'

export const copyShortNameSelector = (state: AppReduxState): boolean => state[APPEARANCE_REDUCER_ID].copyShortName

export const showShortNameSelector = (state: AppReduxState): boolean => state[APPEARANCE_REDUCER_ID].showShortName

export const batchExecuteSelector = (state: AppReduxState): boolean => state[APPEARANCE_REDUCER_ID].batchExecute
