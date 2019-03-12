// @flow
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
  const initial = cut
  const final = 42 - cut

  return `${address.substring(0, initial)}...${address.substring(final)}`
}