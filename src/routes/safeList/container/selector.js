// @flow
import { createStructuredSelector } from 'reselect'
import { safesListSelector } from '~/routes/safeList/store/selectors'

export default createStructuredSelector({
  safes: safesListSelector,
})
