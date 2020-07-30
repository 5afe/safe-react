//
import { } from 'react-router-dom'
import { buildMatchPropsFrom } from 'src/test/utils/buildReactRouterProps'
import { safeSelector } from 'src/logic/safe/store/selectors/index'
import { } from 'src/logic/store'
import { } from 'src/logic/safe/store/models/safe'

export const getSafeFrom = (state, safeAddress) => {
  const match = buildMatchPropsFrom(safeAddress)
  const safe = safeSelector(state)
  if (!safe) throw new Error()

  return safe
}
