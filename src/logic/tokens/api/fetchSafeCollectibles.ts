import { getCollectibles, SafeCollectibleResponse } from '@gnosis.pm/safe-react-gateway-sdk'

import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { store } from 'src/store'
import { currentNetworkId } from 'src/logic/config/store/selectors'

export const fetchSafeCollectibles = async (safeAddress: string): Promise<SafeCollectibleResponse[]> => {
  const state = store.getValue()
  return getCollectibles(CONFIG_SERVICE_URL, currentNetworkId(state), checksumAddress(safeAddress))
}
