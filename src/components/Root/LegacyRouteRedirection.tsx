import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { DEFAULT_CHAIN_ID, PUBLIC_URL } from 'src/utils/constants'
import { History } from 'history'
import { NETWORK_TO_MIGRATE } from '../StoreMigrator/utils'
import { ShortName, CHAIN_ID } from 'src/config/chain.d'

type Props = {
  history: History
}

const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'

// Legacy route subdomains mapped to their shortNames
const LEGACY_ROUTE_SHORT_NAMES: Record<NETWORK_TO_MIGRATE, ShortName> = {
  arbitrum: 'arb1',
  bsc: 'bnb',
  ewc: 'ewt',
  polygon: 'matic',
  rinkeby: 'rin',
  volta: 'vt',
  xdai: 'xdai',
}

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

  const subdomain = window.location.hostname.split('.')[0]

  const DEFAULT_SHORT_NAME = DEFAULT_CHAIN_ID === CHAIN_ID.RINKEBY ? LEGACY_ROUTE_SHORT_NAMES.rinkeby : 'eth'
  const shortName = Object.keys(LEGACY_ROUTE_SHORT_NAMES).includes(subdomain)
    ? LEGACY_ROUTE_SHORT_NAMES[subdomain]
    : DEFAULT_SHORT_NAME

  // Insert shortName before Safe address
  const safeAddressIndex = hash.indexOf('0x')
  const newPathname = (hash.slice(0, safeAddressIndex) + `${shortName}:` + hash.slice(safeAddressIndex)).replace(
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
