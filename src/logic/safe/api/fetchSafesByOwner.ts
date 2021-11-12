import { getOwnedSafes } from '@gnosis.pm/safe-react-gateway-sdk'

import { getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  return getOwnedSafes(CONFIG_SERVICE_URL, getNetworkId(), checksumAddress(ownerAddress)).then(({ safes }) => safes)
}
