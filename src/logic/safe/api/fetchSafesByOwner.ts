import { getOwnedSafes } from '@gnosis.pm/safe-react-gateway-sdk'

import { getGatewayUrl, _getChainId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  return getOwnedSafes(getGatewayUrl(), _getChainId(), checksumAddress(ownerAddress)).then(({ safes }) => safes)
}
