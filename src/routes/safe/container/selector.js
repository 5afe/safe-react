// @flow
import { createStructuredSelector } from 'reselect'
import { safeSelector, type SafeSelectorProps } from '~/routes/safe/store/selectors'

export type SelectorProps = {
  safe: SafeSelectorProps,
}

export default createStructuredSelector({
  safe: safeSelector,
})
