import { createSelector } from 'reselect'

import { safesWithNamesAsList } from 'src/logic/safe/store/selectors'

/**
 * Sort safe list by the name in the address book
 */
export const sortedSafeListSelector = createSelector([safesWithNamesAsList], (safes) =>
  safes.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)),
)
