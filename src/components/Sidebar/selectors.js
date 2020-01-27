// @flow
import { List } from 'immutable'
import { createSelector, type Selector } from 'reselect'
import { type Safe } from '~/routes/safe/store/models/safe'
import { safesListSelector } from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/safeStore'

export const sortedSafeListSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
  safesListSelector,
  (safes: List<Safe>): List<Safe> => safes.sort((a: Safe, b: Safe) => (a.name > b.name ? 1 : -1)),
)
