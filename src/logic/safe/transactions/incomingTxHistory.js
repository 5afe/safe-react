// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getIncomingTxServiceUriTo, getTxServiceHost } from '~/config'

export const buildIncomingTxServiceUrl = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getIncomingTxServiceUriTo(address)

  return `${host}${base}`
}
