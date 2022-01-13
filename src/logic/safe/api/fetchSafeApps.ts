import { getSafeApps, SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'

import { getGatewayUrl, _getChainId } from 'src/config'
export const fetchSafeAppsList = async (): Promise<SafeAppData[]> => {
  return getSafeApps(getGatewayUrl(), _getChainId())
}
