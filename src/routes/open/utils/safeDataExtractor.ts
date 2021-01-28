import { List } from 'immutable'

import { makeOwner } from 'src/logic/safe/store/models/owner'
import { SafeOwner } from 'src/logic/safe/store/models/safe'

export type CreateSafeValues = {
  confirmations: string
  name: string
  owner0Address?: string
  owner0Name?: string
  safeCreationSalt: number
  gasLimit?: number
  owners?: number
}

export const getAccountsFrom = (values: CreateSafeValues): string[] => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => /^owner\d+Address$/.test(key))

  return accounts.map((account) => values[account]).slice(0, values.owners)
}

export const getNamesFrom = (values: CreateSafeValues): string[] => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => /^owner\d+Name$/.test(key))

  return accounts.map((account) => values[account]).slice(0, values.owners)
}

export const getOwnersFrom = (names: string[], addresses: string[]): List<SafeOwner> => {
  const owners = names.map((name, index) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

export const getThresholdFrom = (values: CreateSafeValues): number => Number(values.confirmations)

export const getSafeNameFrom = (values: CreateSafeValues): string => values.name

export const getSafeCreationSaltFrom = (values: CreateSafeValues): number => values.safeCreationSalt
