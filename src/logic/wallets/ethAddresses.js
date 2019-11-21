// @flow
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const sameAddress = (firstAddress: string, secondAddress: string): boolean => {
  if (!firstAddress) {
    return false
  }

  if (!secondAddress) {
    return false
  }

  return firstAddress.toLowerCase() === secondAddress.toLowerCase()
}

export const shortVersionOf = (address: string, cut: number) => {
  const final = 42 - cut

  if (!address) return 'Unknown address'
  if (address.length < final) return address
  return `${address.substring(0, cut)}...${address.substring(final)}`
}
