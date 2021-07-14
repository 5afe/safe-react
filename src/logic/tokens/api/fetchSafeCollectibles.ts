import { getCollectibles, GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk'
import { getClientGatewayUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export type CollectibleResult = GatewayDefinitions['SafeCollectibleResponse']

export const fetchSafeCollectibles = async (safeAddress: string): Promise<CollectibleResult[]> => {
  return getCollectibles(getClientGatewayUrl(), checksumAddress(safeAddress))
}
