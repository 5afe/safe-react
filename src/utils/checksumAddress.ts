import { getWeb3 } from 'src/config'

export const checksumAddress = (address: string): string => {
  return getWeb3().utils.toChecksumAddress(address)
}
