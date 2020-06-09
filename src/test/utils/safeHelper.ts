//
import { } from 'react-router-dom'
import { buildMatchPropsFrom } from 'src/test/utils/buildReactRouterProps'
import { safeSelector } from 'src/routes/safe/store/selectors/index'
import { } from 'src/store'
import { } from 'src/routes/safe/store/models/safe'

export const getSafeFrom = (state, safeAddress) => {
  const match = buildMatchPropsFrom(safeAddress)
  const safe = safeSelector(state)
  if (!safe) throw new Error()

  return safe
}
