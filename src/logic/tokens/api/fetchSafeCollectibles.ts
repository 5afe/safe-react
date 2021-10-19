import { getCollectibles, GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk'
import { getClientGatewayUrl, getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export type CollectibleResult = GatewayDefinitions['SafeCollectibleResponse']

export const fetchSafeCollectibles = async (safeAddress: string): Promise<CollectibleResult[]> => {
  return getCollectibles(getClientGatewayUrl(), getNetworkId().toString(), checksumAddress(safeAddress))
}
