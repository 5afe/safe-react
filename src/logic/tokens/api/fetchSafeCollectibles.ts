import { getCollectibles, SafeCollectibleResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { _getChainId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const fetchSafeCollectibles = async (safeAddress: string): Promise<SafeCollectibleResponse[]> => {
  return getCollectibles(_getChainId(), checksumAddress(safeAddress))
}
