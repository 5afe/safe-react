// @flow
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'

export const safesSelector = (state: GlobalState): List<Safe> => state.safes.toList()

export default createStructuredSelector({
  safes: safesSelector,
})
