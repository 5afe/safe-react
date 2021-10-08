import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { getNetworks, getNetworkId, getShortChainNameById } from 'src/config'
import { history } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'
import { sameString } from 'src/utils/strings'

const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'
const LegacyRouteRedirection = (): ReactElement | null => {
  const { pathname, hash, search } = location

  const isLegacyRoute = pathname === `${PUBLIC_URL}/` && hash.startsWith('#/')

  if (!isLegacyRoute) return null

  const match = matchPath<{ [LEGACY_SAFE_ADDRESS_SLUG]: string }>(history.location.hash, {
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

  const networkLabel = window.location.hostname.split('.')[0] // rinkeby
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
