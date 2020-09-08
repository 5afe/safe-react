import { getIncomingTxServiceUriTo, getTxServiceHost } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildIncomingTxServiceUrl = (safeAddress: string): string => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getIncomingTxServiceUriTo(address)

  return `${host}${base}`
}
