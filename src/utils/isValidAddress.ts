import { isValidShortChainName } from 'src/routes/routes'
import { isAddress, isHexStrict } from 'web3-utils'
import { parsePrefixedAddress } from './prefixedAddress'

export const isValidAddress = (address?: string): boolean => {
  if (address) {
    // `isAddress` do not require the string to start with `0x`
    // `isHexStrict` ensures the address to start with `0x` aside from being a valid hex string
    return isHexStrict(address) && isAddress(address)
  }

  return false
}

export const isValidPrefixedAddress = (value?: string): boolean => {
  if (!value || typeof value !== 'string') {
    return false
  }

  const { prefix, address } = parsePrefixedAddress(value)

  return isValidShortChainName(prefix) && isValidAddress(address)
}
