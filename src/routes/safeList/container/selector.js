// @flow
import { createStructuredSelector } from 'reselect'
import { safesSelector } from '~/routes/safeList/store/selectors'

export default createStructuredSelector({
  safes: safesSelector,
})
