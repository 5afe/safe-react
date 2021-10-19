import { getSafeInfo as fetchSafeInfo, GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { getClientGatewayUrl, getNetworkId } from 'src/config'

export type SafeInfo = GatewayDefinitions['SafeAppInfo']

export const getSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  try {
    return await fetchSafeInfo(getClientGatewayUrl(), getNetworkId().toString(), safeAddress)
  } catch (e) {
    throw new CodedException(Errors._605, e.message)
  }
}
