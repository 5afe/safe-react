//
import { List } from 'immutable'

import { makeOwner } from 'routes/safe/store/models/owner'

export const getAccountsFrom = (values) => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => /^owner\d+Address$/.test(key))

  return accounts.map((account) => values[account]).slice(0, values.owners)
}

export const getNamesFrom = (values) => {
  const accounts = Object.keys(values)
    .sort()
    .filter((key) => /^owner\d+Name$/.test(key))

  return accounts.map((account) => values[account]).slice(0, values.owners)
}

export const getOwnersFrom = (names, addresses) => {
  const owners = names.map((name, index) => makeOwner({ name, address: addresses[index] }))

  return List(owners)
}

export const getThresholdFrom = (values) => Number(values.confirmations)

export const getSafeNameFrom = (values) => values.name
