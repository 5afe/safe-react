import { getModuleTxServiceUriFrom, getTxServiceUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildModuleTxServiceUrl = (safeAddress: string): string => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getModuleTxServiceUriFrom(address)

  return `${host}/${base}`
}
