import { List } from 'immutable'
import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { sameString } from 'src/utils/strings'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const sameAddress = (firstAddress: string | undefined, secondAddress: string | undefined): boolean => {
  return sameString(firstAddress, secondAddress)
}

export const shortVersionOf = (value: string, cut: number): string => {
  if (!value) {
    return 'Unknown'
  }

  const final = value.length - cut
  if (value.length <= cut) {
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
