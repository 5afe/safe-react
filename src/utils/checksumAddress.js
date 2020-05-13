// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'

export const checksumAddress = (address: string) => {
  if (!address) return null
  return getWeb3().utils.toChecksumAddress(address)
}
