// 
import { getIncomingTxServiceUriTo, getTxServiceHost } from '~/config'
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const buildIncomingTxServiceUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getIncomingTxServiceUriTo(address)

  return `${host}${base}`
}
