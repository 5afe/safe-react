// 
import { List } from 'immutable'
import { createSelector } from 'reselect'

import { } from 'routes/safe/store/models/safe'
import { safesListSelector } from 'routes/safe/store/selectors'
import { } from 'store/index'

export const sortedSafeListSelector = createSelector(
  safesListSelector,
  (safes) => safes.sort((a, b) => (a.name > b.name ? 1 : -1)),
)
