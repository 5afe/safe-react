import { LoadFormValues } from 'src/routes/load/container/Load'
import { FIELD_CUSTOM_SAFE_NAME, FIELD_SAFE_NAME, getNumOwnersFrom } from 'src/routes/open/components/fields'

export type CreateSafeValues = {
  confirmations: string
  [FIELD_SAFE_NAME]: string
  [FIELD_CUSTOM_SAFE_NAME]?: string
  owner0Address?: string
  owner0Name?: string
  safeCreationSalt: number
  gasLimit?: number
  owners?: number | string
}

const getByRegexFrom =
  (regex: RegExp) =>
  (values: CreateSafeValues | LoadFormValues): string[] => {
    const accounts = Object.keys(values)
      .sort()
      .filter((key) => regex.test(key))

    const numOwners = getNumOwnersFrom(values)
    return accounts.map((account) => values[account]).slice(0, numOwners)
  }

export const getAccountsFrom = getByRegexFrom(/^owner\d+Address$/)

export const getNamesFrom = getByRegexFrom(/^owner\d+Name$/)

export const getThresholdFrom = (values: CreateSafeValues): number => Number(values.confirmations)

export const getSafeNameFrom = (values: CreateSafeValues): string =>
  values[FIELD_CUSTOM_SAFE_NAME] || values[FIELD_SAFE_NAME]

export const getSafeCreationSaltFrom = (values: CreateSafeValues): number => values.safeCreationSalt
