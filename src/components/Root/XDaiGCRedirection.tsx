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
    return null
  }

  // window.location.pathname will have PUBLIC_URL
  const hasXDaiShortName = pathname.includes(`${PUBLIC_URL}/${SHORT_NAME.XDAI}:`)

  if (!hasXDaiShortName) {
    return null
  }

  // history.location.pathname is modified as history object has
  // { basename: PUBLIC_URL }
  const newPathname = `${history.location.pathname.replace(
    `/${SHORT_NAME.XDAI}:`,
    `/${SHORT_NAME.GNOSIS_CHAIN}:`,
  )}${search}`

  return (
    <Router history={history}>
      <Redirect to={newPathname} />
    </Router>
  )
}

export default XDaiGCRedirection
