import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { getNetworks, getNetworkId, getShortChainNameById } from 'src/config'
import { PUBLIC_URL } from 'src/utils/constants'
import { sameString } from 'src/utils/strings'
import { History } from 'history'

type Props = {
  history: History
}

const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'
const LEGACY_HOST_RE = /-?(rinkeby|xdai|arbitrum|ewc|volta|polygon|bsc)(?=\.)/

const LegacyRouteRedirection = ({ history }: Props): ReactElement | null => {
  const { href, host, pathname, hash, search } = window.location

  // Redirect https://xdai.gnosis-safe.io to https://gnosis-safe.io
  if (LEGACY_HOST_RE.test(host)) {
    const newUrl = href.replace(LEGACY_HOST_RE, '')
    window.location.replace(newUrl)
    return null
  }

  const isLegacyRoute = pathname === `${PUBLIC_URL}/` && hash.startsWith('#/')

  if (!isLegacyRoute) return null

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

  const networkLabel = window.location.hostname.split('.')[0] // 'rinkeby'
  const networkId = getNetworks().find(({ label }) => sameString(label, networkLabel))?.id || getNetworkId()
  const shortName = getShortChainNameById(networkId)

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
