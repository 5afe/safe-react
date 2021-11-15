import { getOwnedSafes } from '@gnosis.pm/safe-react-gateway-sdk'
import { currentNetworkId } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export const fetchSafesByOwner = async (ownerAddress: string): Promise<string[]> => {
  const networkId = currentNetworkId(store.getState())
  return getOwnedSafes(CONFIG_SERVICE_URL, networkId, checksumAddress(ownerAddress)).then(({ safes }) => safes)
}
