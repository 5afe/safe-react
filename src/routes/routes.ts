export const SAFE_PARAM_ADDRESS = 'address'
export const SAFELIST_ADDRESS = '/safes'
export const OPEN_ADDRESS = '/open'
export const LOAD_ADDRESS = '/load'
export const WELCOME_ADDRESS = '/welcome'

export enum SAFE_ROUTES {
  ASSETS_BASE_ROUTE = '/safes/:safeAddress/balances',
  ASSETS_BALANCES = '/safes/:safeAddress/balances',
  ASSETS_COLLECTIBLES = '/safes/:safeAddress/balances/collectibles',
  TRANSACTIONS = '/safes/:safeAddress/transactions',
  ADDRESS_BOOK = '/safes/:safeAddress/address-book',
  APPS = '/safes/:safeAddress/apps',
  SETTINGS_BASE_ROUTE = '/safes/:safeAddress/settings',
  SETTINGS_DETAILS = '/safes/:safeAddress/settings/details',
  SETTINGS_OWNERS = '/safes/:safeAddress/settings/owners',
  SETTINGS_POLICIES = '/safes/:safeAddress/settings/policies',
  SETTINGS_SPENDING_LIMIT = '/safes/:safeAddress/settings/spending-limit',
  SETTINGS_ADVANCED = '/safes/:safeAddress/settings/advanced',
}
