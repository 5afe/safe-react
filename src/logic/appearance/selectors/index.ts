import { createSelector } from 'reselect'

import { AppReduxState } from 'src/store'
import { AppearanceState, APPEARANCE_REDUCER_ID } from '../reducer/appearance'

const appearanceStateSelector = (state: AppReduxState): AppearanceState => state[APPEARANCE_REDUCER_ID]

export const copyShortNameSelector = createSelector(
  appearanceStateSelector,
  ({ copyShortName }: AppearanceState): boolean => copyShortName,
)

export const showShortNameSelector = createSelector(
  appearanceStateSelector,
  ({ showShortName }: AppearanceState): boolean => showShortName,
)
