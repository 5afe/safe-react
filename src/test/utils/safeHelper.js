// 
import { } from 'react-router-dom'
import { buildMatchPropsFrom } from '~/test/utils/buildReactRouterProps'
import { safeSelector } from '~/routes/safe/store/selectors/index'
import { } from '~/store'
import { } from '~/routes/safe/store/models/safe'

export const getSafeFrom = (state, safeAddress) => {
  const match = buildMatchPropsFrom(safeAddress)
  const safe = safeSelector(state, { match })
  if (!safe) throw new Error()

  return safe
}
