import { LoadFormValues } from 'src/routes/load/container/Load'
import { getNumOwnersFrom } from 'src/routes/open/components/fields'

export type CreateSafeValues = {
  confirmations: string
  name: string
  owner0Address?: string
  owner0Name?: string
  safeCreationSalt: number
  gasLimit?: number
  owners?: number | string
}

const getByRegexFrom = (regex: RegExp) => (values: CreateSafeValues | LoadFormValues): string[] => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => regex.test(key))

  const numOwners = getNumOwnersFrom(values)
  return accounts.map((account) => values[account]).slice(0, numOwners)
}

export const getAccountsFrom = getByRegexFrom(/^owner\d+Address$/)

export const getNamesFrom = getByRegexFrom(/^owner\d+Name$/)

export const getThresholdFrom = (values: CreateSafeValues): number => Number(values.confirmations)

export const getSafeNameFrom = (values: CreateSafeValues): string => values.name

export const getSafeCreationSaltFrom = (values: CreateSafeValues): number => values.safeCreationSalt
