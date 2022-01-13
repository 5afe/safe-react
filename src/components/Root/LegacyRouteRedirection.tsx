import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { PUBLIC_URL } from 'src/utils/constants'
import { History } from 'history'
import { ShortName } from 'src/config/chain'
import { NETWORK_TO_MIGRATE } from '../StoreMigrator/utils'

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
  const shortName = Object.keys(LEGACY_ROUTE_SHORT_NAMES).includes(subdomain)
    ? LEGACY_ROUTE_SHORT_NAMES[subdomain]
    : 'eth' // When not mapped subdomain, it is mainnet as it had no subdomain

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
