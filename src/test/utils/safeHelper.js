// @flow
import { buildMatchPropsFrom } from '~/test/utils/buildReactRouterProps'
import { safeSelector } from '~/routes/safe/store/selectors/index'
import { type Match } from 'react-router-dom'
import { type GlobalState } from '~/store'
import { type Safe } from '~/routes/safe/store/models/safe'

export const getSafeFrom = (state: GlobalState, safeAddress: string): Safe => {
  const match: Match = buildMatchPropsFrom(safeAddress)
  const safe = safeSelector(state, { match })
  if (!safe) throw new Error()

  return safe
}
