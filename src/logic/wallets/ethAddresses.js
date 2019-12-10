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

export const shortVersionOf = (value: string, cut: number) => {
  if (!value) {
    return 'Unknown'
  }

  const final = value.length - cut
  if (value.length < final) {
    return value
  }

  return `${value.substring(0, cut)}...${value.substring(final)}`
}
