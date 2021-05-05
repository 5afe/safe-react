import { getSafeClientGatewayBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildSafeInformationUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  const url = getSafeClientGatewayBaseUrl(address)
  return `${url}/`
}
