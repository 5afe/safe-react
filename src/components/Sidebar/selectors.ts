import { createSelector } from 'reselect'

import { safesListSelector } from 'src/logic/safe/store/selectors'

export const sortedSafeListSelector = createSelector(safesListSelector, (safes) =>
  safes.sort((a, b) => (a.name > b.name ? 1 : -1)),
)
