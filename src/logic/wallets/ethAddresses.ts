import { List } from 'immutable'
import { SafeRecord } from 'src/routes/safe/store/models/safe'
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

export const shortVersionOf = (value: string, cut: number): string => {
  if (!value) {
    return 'Unknown'
  }

  const final = value.length - cut
  if (value.length < final) {
    return value
  }

  return `${value.substring(0, cut)}...${value.substring(final)}`
}

export const isUserAnOwner = (safe: SafeRecord, userAccount: string): boolean => {
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

export const isUserAnOwnerOfAnySafe = (safes: List<SafeRecord> | SafeRecord[], userAccount: string): boolean =>
  safes.some((safe: SafeRecord) => isUserAnOwner(safe, userAccount))

export const isValidEnsName = (name: string): boolean => /^([\w-]+\.)+(eth|test|xyz|luxe)$/.test(name)
