import { getIncomingTxServiceUriTo, getTxServiceUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildIncomingTxServiceUrl = (safeAddress: string): string => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getIncomingTxServiceUriTo(address)

  return `${host}/${base}`
}
