// @flow
import { List } from 'immutable'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'

export const safesSelector = (state: GlobalState): List<Safe> => state.safes.toList()
