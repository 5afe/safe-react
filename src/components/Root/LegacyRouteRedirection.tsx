import { matchPath, Router, Redirect } from 'react-router'
import { ReactElement } from 'react'

import { PUBLIC_URL } from 'src/utils/constants'
import { sameString } from 'src/utils/strings'
import { History } from 'history'
import { AppReduxState } from 'src/store'
import { currentNetworkId, currentNetworks, getNetworkById } from 'src/logic/config/store/selectors'
import { useSelector } from 'react-redux'

type Props = {
  history: History
}

const LEGACY_SAFE_ADDRESS_SLUG = 'safeAddress'

const LegacyRouteRedirection = ({ history }: Props): ReactElement | null => {
  const { pathname, hash, search } = window.location

  const isLegacyRoute = pathname === `${PUBLIC_URL}/` && hash.startsWith('#/')

  const networks = useSelector(currentNetworks)
  const currentNetwork = useSelector(currentNetworkId)

  const networkLabel = window.location.hostname.split('.')[0] // 'rinkeby'
  const networkId = networks.find(({ chainName }) => sameString(chainName, networkLabel))?.chainId || currentNetwork
  const { shortName } = useSelector((state: AppReduxState) => getNetworkById(state, networkId))

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
