import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { checkAddressChecksum, toChecksumAddress } from 'web3-utils'

export const checksumAddress = (address: string): string => {
  try {
    return toChecksumAddress(address)
  } catch (err) {
    logError(Errors._102, err.message)
    return ''
  }
}

export const isChecksumAddress = (address?: string): boolean => {
  if (address) {
    return checkAddressChecksum(address)
  }

  return false
}
