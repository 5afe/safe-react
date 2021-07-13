export const SAFE_PARAM_ADDRESS = 'address'
export const SAFELIST_ADDRESS = '/safes'
export const OPEN_ADDRESS = '/open'
export const LOAD_ADDRESS = '/load'
export const WELCOME_ADDRESS = '/welcome'

export enum SAFE_ROUTES {
  DETAILS = `/safes/:address/settings/details`,
  OWNERS = `/safes/:address/settings/owners`,
  POLICIES = `/safes/:address/settings/policies`,
  SPENDING_LIMIT = `/safes/:address/settings/spending-limit`,
  ADVANCED = `/safes/:address/settings/advanced`,
}
