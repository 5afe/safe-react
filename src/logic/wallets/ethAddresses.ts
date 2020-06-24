export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const sameAddress = (firstAddress, secondAddress) => {
  if (!firstAddress) {
    return false
  }

  if (!secondAddress) {
    return false
  }

  return firstAddress.toLowerCase() === secondAddress.toLowerCase()
}

export const shortVersionOf = (value, cut) => {
  if (!value) {
    return 'Unknown'
  }

  const final = value.length - cut
  if (value.length < final) {
    return value
  }

  return `${value.substring(0, cut)}...${value.substring(final)}`
}

export const isUserOwner = (safe, userAccount) => {
  if (!safe) {
    return false
  }

  if (!userAccount) {
    return false
  }

  const { owners } = safe
  if (!owners) {
    return false
  }

  return owners.find((owner) => sameAddress(owner.address, userAccount)) !== undefined
}

export const isUserOwnerOnAnySafe = (safes, userAccount) => safes.some((safe) => isUserOwner(safe, userAccount))

export const isValidEnsName = (name) => /^([\w-]+\.)+(eth|test|xyz|luxe)$/.test(name)
