import { getSafeServiceBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildModuleTxServiceUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  const url = getSafeServiceBaseUrl(address)

  return `${url}/module-transactions/`
}
