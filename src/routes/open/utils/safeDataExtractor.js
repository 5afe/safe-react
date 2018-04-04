// @flow
export const getAccountsFrom = (values: Object): string[] => {
  const accounts = Object.keys(values).sort().filter(key => /^owner\d+Address$/.test(key))

  return accounts.map(account => values[account]).slice(0, values.owners)
}

export const getNamesFrom = (values: Object): string[] => {
  const accounts = Object.keys(values).sort().filter(key => /^owner\d+Name$/.test(key))

  return accounts.map(account => values[account]).slice(0, values.owners)
}

export const getThresholdFrom = (values: Object): number => Number(values.confirmations)

export const getSafeNameFrom = (values: Object): string => values.name
