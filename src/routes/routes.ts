export const SAFE_PARAM_ADDRESS = 'address'
export const SAFELIST_ADDRESS = '/safes'
export const OPEN_ADDRESS = '/open'
export const LOAD_ADDRESS = '/load'
export const WELCOME_ADDRESS = '/welcome'

export enum SAFE_ROUTES {
  ASSETS_BALANCES = '/safes/:address/balances',
  ASSETS_COLLECTIBLES = '/safes/:address/balances/collectibles',
  TRANSACTIONS = '/safes/:address/transactions',
  ADDRESS_BOOK = '/safes/:address/address-book',
  APPS = '/safes/:address/apps',
  SETTINGS_DETAILS = '/safes/:address/settings/details',
  SETTINGS_OWNERS = '/safes/:address/settings/owners',
  SETTINGS_POLICIES = '/safes/:address/settings/policies',
  SETTINGS_SPENDING_LIMIT = '/safes/:address/settings/spending-limit',
  SETTINGS_ADVANCED = '/safes/:address/settings/advanced',
}
