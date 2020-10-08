import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const checksumAddress = (address: string): string => {
  return getWeb3().utils.toChecksumAddress(address)
}
