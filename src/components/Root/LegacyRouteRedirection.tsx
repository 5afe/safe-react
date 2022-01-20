import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { IS_PRODUCTION, PUBLIC_URL } from 'src/utils/constants'
import { History } from 'history'

type Props = {
  history: History
}

enum SHORT_NAME {
  RINKEBY = 'rin',
  MAINNET = 'eth',
}

const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'

const LegacyRouteRedirection = ({ history }: Props): ReactElement | null => {
  const { pathname, hash, search } = window.location

  const isLegacyRoute = pathname === `${PUBLIC_URL}/` && hash.startsWith('#/')

  if (!isLegacyRoute) {
    return null
  }

  // :subdir was '/safes' or '/load'
  const match = matchPath<{ [LEGACY_SAFE_ADDRESS_SLUG]: string }>(hash, {
    path: `#/:subdir/:${LEGACY_SAFE_ADDRESS_SLUG}`,
  })

  const safeAddress = match?.params?.[LEGACY_SAFE_ADDRESS_SLUG]

  if (!match || !safeAddress) {
    return (
      <Router history={history}>
        <Redirect to={hash.replace('#/', '')} />
      </Router>
    )
  }

  const DEFAULT_SHORT_NAME = IS_PRODUCTION ? SHORT_NAME.MAINNET : SHORT_NAME.RINKEBY

  // Insert shortName before Safe address
  const safeAddressIndex = hash.indexOf('0x')
  const newPathname = (
    hash.slice(0, safeAddressIndex) +
    `${DEFAULT_SHORT_NAME}:` +
    hash.slice(safeAddressIndex)
  ).replace(
    /(#\/safes|#\/)/, // Remove '#/safes' and '#/'
    '',
  )

  return (
    <Router history={history}>
      <Redirect to={`${newPathname}${search}`} />
    </Router>
  )
}

export default LegacyRouteRedirection
