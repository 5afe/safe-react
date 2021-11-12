import { getCollectibles, SafeCollectibleResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export const fetchSafeCollectibles = async (safeAddress: string): Promise<SafeCollectibleResponse[]> => {
  return getCollectibles(CONFIG_SERVICE_URL, getNetworkId(), checksumAddress(safeAddress))
}
