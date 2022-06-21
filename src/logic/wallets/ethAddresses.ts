import { List } from 'immutable'
import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { sameString } from 'src/utils/strings'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const sameAddress = (firstAddress: string | undefined, secondAddress: string | undefined): boolean => {
  return sameString(firstAddress, secondAddress)
}

export const isEmptyAddress = (address: string | undefined): boolean => {
  if (!address) return true
  return sameAddress(address, EMPTY_DATA) || sameAddress(address, ZERO_ADDRESS)
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

  return owners.find((address) => sameAddress(address, userAccount)) !== undefined
}

export const isUserAnOwnerOfAnySafe = (safes: List<SafeRecord> | SafeRecord[], userAccount: string): boolean =>
  safes.some((safe: SafeRecord) => isUserAnOwner(safe, userAccount))

export const isValidEnsName = (name: string): boolean => /^([\w-]+\.)+(eth|test|xyz|luxe|ewc)$/.test(name)

export const isValidCryptoDomainName = (name: string): boolean =>
  /^([\w-]+\.)+(crypto|nft|x|wallet|bitcoin|dao|888|coin)$/.test(name)
