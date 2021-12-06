import { getCollectibles, SafeCollectibleResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'

export const fetchSafeCollectibles = async (safeAddress: string): Promise<SafeCollectibleResponse[]> => {
  return getCollectibles(GATEWAY_URL, _getChainId(), checksumAddress(safeAddress))
}
