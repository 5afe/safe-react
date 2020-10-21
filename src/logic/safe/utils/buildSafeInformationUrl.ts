import { getTxServiceUrl, getSafeServiceUri } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildSafeInformationUrl = (safeAddress: string): string => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getSafeServiceUri(address)

  return `${host}/${base}`
}
