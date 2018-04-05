// @flow
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'

export const safesMapSelector = (state: GlobalState): Map<string, Safe> => state.safes
export const safesListSelector = (state: GlobalState): List<Safe> => state.safes.toList()
