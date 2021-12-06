import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { getChainInfo } from 'src/config'
import { PUBLIC_URL } from 'src/utils/constants'
import { sameString } from 'src/utils/strings'
import { History } from 'history'
import { getChains } from 'src/config/cache/chains'

type Props = {
  history: History
}

const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'

const LegacyRouteRedirection = ({ history }: Props): ReactElement | null => {
  const { pathname, hash, search } = window.location

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

  const chainLabel = window.location.hostname.split('.')[0] // 'rinkeby'
  const chain = getChains().find((chain) => sameString(chain.chainName, chainLabel)) || getChainInfo()

  // Insert shortName before Safe address
  const safeAddressIndex = hash.indexOf('0x')
  const newPathname = (hash.slice(0, safeAddressIndex) + `${chain.shortName}:` + hash.slice(safeAddressIndex)).replace(
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
