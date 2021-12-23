import { getSafeApps, SafeAppData } from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'
import { GATEWAY_URL } from 'src/utils/constants'

export const fetchSafeAppsList = async (): Promise<SafeAppData[]> => {
  return getSafeApps(GATEWAY_URL, _getChainId())
}
