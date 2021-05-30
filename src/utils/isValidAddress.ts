import { isAddress, isHexStrict } from 'web3-utils'

export const isValidAddress = (address?: string): boolean => {
  if (address) {
    // `isAddress` do not require the string to start with `0x`
    // `isHexStrict` forces the address to start with `0x`
    return isAddress(address) && isHexStrict(address)
  }

  return false
}
