import { getSafeApps, SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'

export const fetchSafeAppsList = async (): Promise<SafeAppData[]> => {
  return getSafeApps(_getChainId(), {
    client_url: window.location.origin,
  })
}
