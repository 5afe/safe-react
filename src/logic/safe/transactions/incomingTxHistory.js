// 
import { getIncomingTxServiceUriTo, getTxServiceHost } from 'src/config'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const buildIncomingTxServiceUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getIncomingTxServiceUriTo(address)

  return `${host}${base}`
}
