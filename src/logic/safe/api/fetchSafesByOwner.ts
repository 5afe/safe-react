import { getOwnedSafes } from '@gnosis.pm/safe-react-gateway-sdk'

import { getClientGatewayUrl, getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  return getOwnedSafes(getClientGatewayUrl(), getNetworkId().toString(), checksumAddress(ownerAddress)).then(
    ({ safes }) => safes,
  )
}
