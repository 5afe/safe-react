// 
import { getIncomingTxServiceUriTo, getTxServiceHost } from 'config'
import { checksumAddress } from 'utils/checksumAddress'

export const buildIncomingTxServiceUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getIncomingTxServiceUriTo(address)

  return `${host}${base}`
}
