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

const cachedSafeInfo = {}

export const memoizedGetSafeInfo = async (safeAddress: string): Promise<SafeInfo> => {
  const safeAddressKey = safeAddress.toLocaleLowerCase?.()
  const hasMemoizedValue = cachedSafeInfo[safeAddressKey] !== undefined

  cachedSafeInfo[safeAddressKey] = hasMemoizedValue
    ? cachedSafeInfo[safeAddressKey]
    : await getSafeInfo(safeAddress).catch(() => null)

  return cachedSafeInfo[safeAddressKey]
}
