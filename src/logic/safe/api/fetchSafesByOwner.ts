import { getOwnedSafes } from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  return getOwnedSafes(GATEWAY_URL, _getChainId(), checksumAddress(ownerAddress)).then(({ safes }) => safes)
}
