import { Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { History } from 'history'

import { isLegacyRoute } from './LegacyRouteRedirection'
import { PUBLIC_URL } from 'src/utils/constants'

enum SHORT_NAME {
  GNOSIS_CHAIN = 'gno',
  XDAI = 'xdai',
}

type Props = {
  history: History
}

const XDaiGCRedirection = ({ history }: Props): ReactElement | null => {
  const { pathname, search, hash } = window.location

  if (isLegacyRoute(pathname, hash)) {
    console.log('isLegacyRoute')
    return null
  }

  const XDAI_ROUTE_PREFIX = `${PUBLIC_URL}/${SHORT_NAME.XDAI}:`
  const GNO_ROUTE_PREFIX = `${PUBLIC_URL}/${SHORT_NAME.GNOSIS_CHAIN}:`

  const hasXDaiShortName = pathname.includes(XDAI_ROUTE_PREFIX)

  if (!hasXDaiShortName) {
    return null
  }

  const newPathname = `${pathname.replace(XDAI_ROUTE_PREFIX, GNO_ROUTE_PREFIX)}${search}`
  console.log('newPathname', newPathname)
  return (
    <Router history={history}>
      <Redirect to={newPathname} />
    </Router>
  )
}

export default XDaiGCRedirection
