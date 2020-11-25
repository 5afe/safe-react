import { getSafeClientGatewayBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildIncomingTxServiceUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeClientGatewayBaseUrl(address)}/transactions/`
}
