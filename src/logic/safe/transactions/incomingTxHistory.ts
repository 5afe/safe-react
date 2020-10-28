import { getSafeServiceBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildIncomingTxServiceUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/incoming-transfers/`
}
