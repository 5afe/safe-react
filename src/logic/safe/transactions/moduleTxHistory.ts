import { getModuleTxServiceUriFrom, getTxServiceHost } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildModuleTxServiceUrl = (safeAddress: string): string => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getModuleTxServiceUriFrom(address)

  return `${host}${base}`
}
