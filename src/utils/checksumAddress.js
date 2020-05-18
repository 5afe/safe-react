// 
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const checksumAddress = (address) => {
  if (!address) return null
  return getWeb3().utils.toChecksumAddress(address)
}
