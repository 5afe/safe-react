import { checkAddressChecksum, toChecksumAddress } from 'web3-utils'

export const checksumAddress = (address: string): string => toChecksumAddress(address)

export const isChecksumAddress = (address?: string): boolean => {
  if (address) {
    return checkAddressChecksum(address)
  }

  return false
}
