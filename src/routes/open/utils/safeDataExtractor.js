// @flow
export const getAccountsFrom = (values: Object): string[] => {
  const accounts = Object.keys(values).filter(key => /^owner\d+Address$/.test(key))

  return accounts.map(account => values[account])
}

export const getNamesFrom = (values: Object): string[] => {
  const accounts = Object.keys(values).filter(key => /^owner\d+Name$/.test(key))

  return accounts.map(account => values[account])
}

export const getThresholdFrom = (values: Object): number => Number(values.confirmations)
