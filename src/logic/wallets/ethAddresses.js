// @flow
import { List } from 'immutable'
import type { Safe } from '~/routes/safe/store/models/safe'
import type { Owner } from '~/routes/safe/store/models/owner'

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

export const isUserOwner = (safe: Safe, userAccount: string): boolean => {
  if (!safe) {
    return false
  }

  if (!userAccount) {
    return false
  }

  const { owners }: List<Owner> = safe
  if (!owners) {
    return false
  }

  return owners.find((owner: Owner) => sameAddress(owner.address, userAccount)) !== undefined
}

export const isUserOwnerOnAnySafe = (safes: List<Safe>, userAccount: string): boolean => safes.some((safe) => isUserOwner(safe, userAccount))
