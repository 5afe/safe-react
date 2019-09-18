// @flow
import { List, Map } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/models/safe'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'

export const safesMapSelector = (state: GlobalState): Map<string, Safe> => state[SAFE_REDUCER_ID].get('safes')

export const safesListSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): List<Safe> => safes.toList(),
)

export const safesCountSelector: Selector<GlobalState, {}, number> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): number => safes.size,
)
